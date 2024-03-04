document.getElementById('generateCards').addEventListener('click', function() {
    const inputText = document.getElementById('inputText').value;
    const inputTextDisplay = document.getElementById('inputText');
    const teamsContainer = document.getElementById('teamsContainer');
    teamsContainer.innerHTML = '';
    
    const teams = inputText.trim().split('\n\n');
  
    teams.forEach(teamInfo => {
        const lines = teamInfo.split('\n');
        const teamName = lines[0];
        const teamMembers = lines.slice(1);
        generateTeamCard(teamName, teamMembers, teamsContainer);
    });
    
    const toggleTextButton = document.getElementById('toggleText');
    if (inputTextDisplay.style.display !== 'none') {
        inputTextDisplay.style.display = 'none';
        toggleTextButton.textContent = 'Mostrar Texto';
    }
});


document.getElementById('toggleText').addEventListener('click', function() {
    const inputText = document.getElementById('inputText');
    if (inputText.style.display === 'none') {
        inputText.style.display = '';
        this.textContent = 'Ocultar Texto';
    } else {
        inputText.style.display = 'none';
        this.textContent = 'Mostrar Texto';
    }
});

function generateTeamCard(teamName, members, container) {
    const card = document.createElement('div');
    card.classList.add('card', 'team-card', 'mb-3');

    let cardHeaderContent = `<div class="card-header d-flex justify-content-between align-items-center">
        ${teamName}
        <button class="toggle-members btn btn-sm btn-outline-secondary">
            <i class="fas fa-minus"></i>
        </button>
    </div>`;

    let membersContent = '<div class="members-container">';
    members.forEach((member, index) => {
        const [role, name] = member.split('-');
        membersContent += `
        <div class="member list-group-item d-flex justify-content-between align-items-center">
            <span class="item-text">${index + 1}. ${role.trim()} - ${name.trim()}</span>
            <div>
                <button class="btn btn-sm btn-danger change-color" data-color="bg-red">Rojo</button>
                <button class="btn btn-sm btn-primary change-color" data-color="bg-blue">Azul</button>
                <button class="btn btn-sm btn-success change-color" data-color="bg-green">Verde</button>
                <button class="btn btn-sm btn-warning change-color" data-color="bg-gold">Dorado</button>
                <button class="btn btn-sm btn-secondary change-color" data-color="">Defecto</button>
            </div>
        </div>`;
    });
    membersContent += '</div>';

    let cardFooterContent = `
        <div class="card-footer">
            <button class="btn btn-sm btn-success export-card">Exportar</button>
        </div>
    `;

    card.innerHTML = cardHeaderContent + membersContent + cardFooterContent;
    container.appendChild(card);

    new Sortable(card.querySelector('.members-container'), {
        animation: 150,
        onEnd: function(evt) {
            const items = Array.from(evt.to.children);
            items.forEach((item, index) => {
                const itemText = item.querySelector('.item-text');
                const splitText = itemText.textContent.split('. ').slice(1).join('. ');
                itemText.textContent = `${index + 1}. ${splitText}`;
            });
        }        
    });

    card.querySelectorAll('.change-color').forEach(button => {
        button.addEventListener('click', function() {
            const colorClass = this.getAttribute('data-color');
            const memberDiv = this.closest('.member');
            memberDiv.classList.remove('bg-red', 'bg-blue', 'bg-green', 'bg-gold');
            if (colorClass) {
                memberDiv.classList.add(colorClass);
            }
        });
    });

    // Cambia la clase del ícono en lugar de textContent
    card.querySelector('.toggle-members').addEventListener('click', function() {
        const membersContainer = card.querySelector('.members-container');
        const icon = this.querySelector('i');
        if (membersContainer.style.display === 'none') {
            membersContainer.style.display = '';
            icon.classList.remove('fa-plus');
            icon.classList.add('fa-minus');
        } else {
            membersContainer.style.display = 'none';
            icon.classList.remove('fa-minus');
            icon.classList.add('fa-plus');
        }
    });

    card.querySelector('.export-card').addEventListener('click', function() {
        const bbCode = exportCardToBBCode(card);
        copyToClipboard(bbCode);
    });
}

function exportCardToBBCode(cardElement) {
    let bbCode = `[b]Equipo ${cardElement.querySelector('.card-header').textContent.trim()}:[/b]\n[list=1]\n`;
    cardElement.querySelectorAll('.member').forEach(member => {
        const roleAndName = member.querySelector('.item-text').textContent.trim();
        let name = roleAndName.substring(roleAndName.lastIndexOf('-') + 1).trim();
        let colorBBCode = '';

        if (member.classList.contains('bg-red')) {
            colorBBCode = '[color=#FF0000]';
        } else if (member.classList.contains('bg-blue')) {
            colorBBCode = '[color=#0080FF]';
        } else if (member.classList.contains('bg-green')) {
            colorBBCode = '[color=#008000]';
        } else if (member.classList.contains('bg-gold')) {
            colorBBCode = '[color=#FFBF00]';
        }
        bbCode += `[*]${colorBBCode}${name}${colorBBCode ? '[/color]' : ''}\n`;
    });
    bbCode += `[/list]\n`;
    return bbCode;
}

function exportAllCards() {
    const allCards = document.querySelectorAll('.team-card');
    let allBBCode = '';
    allCards.forEach(card => {
        allBBCode += exportCardToBBCode(card) + '\n';
    });
    return allBBCode;
}

document.getElementById('exportAll').addEventListener('click', function() {
    const bbCode = exportAllCards();
    copyToClipboard(bbCode);
});

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('El ORBAT se ha copiado al portapapeles.');
}