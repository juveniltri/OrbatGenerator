document.getElementById('generateCards').addEventListener('click', function() {
    console.log("Estamos aqui");
    const inputText = document.getElementById('inputText').value;
    const teamsContainer = document.getElementById('teamsContainer');
    teamsContainer.innerHTML = ''; // Limpiar el contenedor antes de añadir nuevas cards
    
    // Dividir el texto por equipos, asumiendo una línea en blanco entre equipos
    const teams = inputText.trim().split('\n\n');
  
    teams.forEach(teamInfo => {
        const lines = teamInfo.split('\n');
        const teamName = lines[0];
        const teamMembers = lines.slice(1);
        generateTeamCard(teamName, teamMembers, teamsContainer);
    });
});
  
function generateTeamCard(teamName, members, container) {
    const card = document.createElement('div');
    card.classList.add('card', 'team-card', 'mb-3');
    
    let cardContent = `<div class="card-header">${teamName}</div><ul class="list-group list-group-flush sortable">`;
    members.forEach((member, index) => {
        const [role, name] = member.split('-');
        cardContent += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="item-text">${index + 1}. ${role.trim()} - ${name.trim()}</span>
            <div>
            <button class="btn btn-sm btn-danger change-color" data-color="bg-red">Rojo</button>
            <button class="btn btn-sm btn-primary change-color" data-color="bg-blue">Azul</button>
            <button class="btn btn-sm btn-success change-color" data-color="bg-green">Verde</button>
            <button class="btn btn-sm btn-warning change-color" data-color="bg-gold">Dorado</button>
            <button class="btn btn-sm btn-secondary change-color" data-color="">Defecto</button>
            </div>
        </li>`;
    });
    cardContent += `</ul>`;

    card.innerHTML = cardContent;
    container.appendChild(card);

    // Inicializar SortableJS y añadir evento click a los botones para cambiar de color
    new Sortable(card.querySelector('.sortable'), {
        animation: 150,
        onEnd: function() {
            const listItems = card.querySelectorAll('.list-group-item');
            listItems.forEach((item, index) => {
                // Encuentra el <span> dentro del elemento de la lista y actualiza su contenido
                const itemText = item.querySelector('.item-text');
                if(itemText) {
                    const contentParts = itemText.textContent.split('. ');
                    if(contentParts.length > 1) {
                        itemText.textContent = `${index + 1}. ${contentParts.slice(1).join('. ')}`;
                    } else {
                        // En caso de que no haya un punto y espacio, simplemente prepone el nuevo número
                        itemText.textContent = `${index + 1}. ${itemText.textContent}`;
                    }
                }
            });
        }
    });
      

    // Añadir manejadores de eventos para los botones de cambio de color
    card.querySelectorAll('.change-color').forEach(button => {
        button.addEventListener('click', function() {
        const colorClass = this.getAttribute('data-color');
        const listItem = this.closest('.list-group-item');
        // Remover clases de color previas
        listItem.classList.remove('bg-red', 'bg-blue', 'bg-green', 'bg-gold');
        if (colorClass) {
            listItem.classList.add(colorClass);
        }
        });
    });
}