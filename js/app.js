const buscarTrabajo = document.querySelector('#buscar-trabajo');
const resultado = document.querySelector('#resultado');

document.addEventListener('DOMContentLoaded', () => 
    buscarTrabajo.addEventListener('submit', validarFormulario)
);

function validarFormulario(e) {
    e.preventDefault();
    const busqueda = document.querySelector('#busqueda').value;
    if(busqueda.length < 3) {
        mostrarMensaje('Búsqueda muy corta... Añade más información');
        return; 
    }
    consultarAPI(busqueda);
}

function mostrarMensaje(mensaje) {
    const alerta = document.querySelector('.alerta');
    if(!alerta) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('alerta');
        divMensaje.textContent = mensaje;
        divMensaje.style.cssText= 'background-color: #fff; padding: 1rem; text-align: center; margin-top: 1rem';
        buscarTrabajo.appendChild(divMensaje);
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

function consultarAPI(busqueda) {

    const githubUrl = `https://jobs.github.com/positions.json?search=${busqueda}`;

    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(githubUrl)}`;
    
    axios.get(url)
        .then( respuesta => mostrarVacantes(JSON.parse(respuesta.data.contents)) );
}

function mostrarVacantes(vacantes) {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild)
    }
    if(vacantes.length > 0) {
        vacantes.forEach( vacante => {
            const { title, company, type, url } = vacante;
            resultado.innerHTML += `
                <div style="box-shadow: 0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px 0 rgba(0,0,0,.06); background-color: #fff; padding: 1rem; border-radius: .25rem">
                    <h2 style="font-size: 1.5rem; font-weight: 300; margin-bottom: 1.5rem">${title}</h2>
                    <p style="font-weight: 700; text-transform: uppercase">Compañía: <span style="font-weight: 300; text-transform: none">${company}</span></p>
                    <p style="font-weight: 700; text-transform: uppercase">Tipo de contrato: <span style="font-weight: 300; text-transform: none">${type}</span></p>
                    <a style="background-color: rgba(56,178,172,1); display: block; max-width: 32rem; margin: .75rem auto 0 auto; border-radius: .25rem; padding: .5rem; text-transform: uppercase; font-weight: 700; color: rgba(255,255,255,1);     text-align: center; text-decoration: none" href="${url}" target="_blank">Ver vacante</a>
                </div>
            `;
        } )
    } else {
        mostrarMensaje('No hay resultados');
    }
}