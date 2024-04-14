const url = "poke.json";

function toggleNav() {
    document.querySelector('header nav').classList.toggle('show-nav');
}

document.addEventListener('DOMContentLoaded', () => {
    // Cargar los primeros 50 Pokémon al cargar la página
    fetchData(0);
});
function fetchData(valor){
    //calcular el rango segun la pagina
    const  inicioPage   = valor * 50;
    const  finPage      = inicioPage + 50;
    
    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }
        return response.json();
    })
    .then(data => {
        const totalPokemons = data.length;
        const totalPages = Math.ceil(totalPokemons / 50); // Calcular el número total de páginas
        const currentPage = valor + 1; // Sumar 1 porque los valores de página comienzan desde 0
        // Limpiar el conenido anterior del paginador
        const pagi = document.querySelector('.btnsCargar');
        const ul = document.createElement('ul');
        pagi.innerHTML = '';
        // Agregar botones para cada página al paginador
        for (let index = 1; index <= totalPages; index++) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = '#'; // Agregar un href para evitar recargar la página
            a.classList.add('page-btn');
            a.dataset.page = index - 1; // Restar 1 porque los valores de página comienzan desde 0
            a.textContent = index;
            li.appendChild(a);
            ul.appendChild(li);
        }
        pagi.appendChild(ul);

        const contenedor = document.querySelector('.pokemons');
        contenedor.innerHTML = ''; // Limpiar el contenido anterior del contenedor

        // Iterar sobre los Pokémon en el rango especificado
        for (let i = inicioPage; i < finPage && i < data.length; i++) {
            const pokemon = data[i];
            // Crear elementos HTML para cada Pokémon y agregarlos al contenedor
            const cardHtml = createPokemonCard(pokemon);
            contenedor.appendChild(cardHtml);
        }
        
        const pageButtons = document.querySelectorAll('.page-btn');
        pageButtons.forEach(a => {
            a.addEventListener('click', () => {
                const page = parseInt(a.dataset.page);
                fetchData(page);
            });
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
        <div class="imgBx">
            <img src="${pokemon.ThumbnailImage}" alt="${pokemon.ThumbnailAltText}">
        </div>
        <div class="content">
            <div class="details">
                <h2>${pokemon.id}-${pokemon.name}<br><span>${pokemon.abilities}</span></h2>
                <div class="data">
                    <h3>Habilidades<br><span>${pokemon.type}</span></h3>
                    <h3>Peso<br><span>${pokemon.weight}</span></h3>
                    <h3>Altura<br><span>${pokemon.height}</span></h3>
                </div>
                <div class="actionBtn">
                    <button>Información</button>
                </div>
            </div>
        </div>        
    `;

    return card;
}



// Función asíncrona para buscar películas en el JSON
async function buscarPokemon(termino) {
    
    // Hacer una solicitud para obtener el JSON de películas
    const response = await fetch('poke.json');
    // Convertir la respuesta a formato JSON
    const data = await response.json();
    
    
    // Filtrar películas que coincidan con el término de búsqueda en cualquier campo
    const pokemon = data.filter(item => {
        // Convertir todos los valores de las propiedades a minúsculas para una comparación insensible a mayúsculas
        const lowerCaseTermino = termino.toLowerCase();
        // Iterar sobre todas las propiedades del objeto y comprobar si alguna contiene el término de búsqueda
        for (let key in item) {
            if (typeof item[key] === 'string' && item[key].toLowerCase().includes(lowerCaseTermino)) {
                return true; // Si se encuentra una coincidencia, devolver verdadero y agregar la película al resultado
            }
        }
        return false; // Si no se encuentra ninguna coincidencia, devolver falso y excluir la película del resultado
    });
    
   
    return pokemon;
}

// Capturar el campo de búsqueda y la lista de resultados del HTML
const inputBusqueda = document.getElementById('inputBusqueda');
const listaResultados = document.getElementById('listaSugerencias');

// Escuchar el evento de entrada en el campo de búsqueda
inputBusqueda.addEventListener('input', async () => {
    // Obtener el término de búsqueda ingresado por el usuario
    const termino = inputBusqueda.value;
    
    // Llamar a la función buscarPeliculas con el término de búsqueda
    try {
        const peliculasContainer = document.querySelector('.pokemons');
        const peliculas = await buscarPokemon(termino);
        console.log(peliculas);
        // Limpiar la lista de resultados antes de mostrar los nuevos
        peliculasContainer.innerHTML = '';

        // Mostrar los resultados en la lista
        peliculas.forEach(pokemon => {
            const divPelis = document.createElement('div');
            divPelis.classList.add('card');
            divPelis.innerHTML=`
            <div class="imgBx">
            <img src="${pokemon.ThumbnailImage}" alt="${pokemon.ThumbnailAltText}">
            </div>
            <div class="content">
                <div class="details">
                    <h2>${pokemon.id}-${pokemon.name}<br><span>${pokemon.abilities}</span></h2>
                    <div class="data">
                        <h3>${pokemon.name}<br><span>${pokemon.type}</span></h3>
                        <h3>${pokemon.weight}<br><span>asd</span></h3>
                        <h3>${pokemon.height}<br><span>asdasd</span></h3>
                    </div>
                    <div class="actionBtn">
                        <button>Información</button>
                    </div>
                </div>
            </div>        
                `;
                peliculasContainer.appendChild(divPelis)
        });
    } catch (error) {
        console.error('Error al buscar películas:', error);
    }
});