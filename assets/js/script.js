const request = async (user, numeroDePagina, numeroRepositoriosPorPagina) => {

  const baseUrl = 'https://api.github.com/users'

  const responseUser = await fetch(`${baseUrl}/${user}`)
  const responseRepo = await fetch(`${baseUrl}/${user}/repos?page=${numeroDePagina}&per_page=${numeroRepositoriosPorPagina}`)

  const datosUser = await responseUser.json()
  const datosRepo = await responseRepo.json()

  //console.log(datosUser);

  let datosNecesarios = {
    avatar_url: datosUser.avatar_url,
    name: datosUser.name,
    login: datosUser.login,
    public_repos: datosUser.public_repos,
    location: datosUser.location,
    type: datosUser.type,
    repositories: []
  }

  datosRepo.forEach(element => {
    datosNecesarios.repositories.push(element)
  });

  //console.log(datosNecesarios)

  return datosNecesarios

}

const getUser = async (user, numeroPaginas, numeroRepositoriosPorPagina) => {

  const traerRequest = await request(user, numeroPaginas, numeroRepositoriosPorPagina)

  document.querySelector('#columnaDatosUsario').innerHTML = `
      <h4>Datos de Usuario</h4>
      <img src=${traerRequest.avatar_url} width='192' height='192'>
      <p>Nombre de usuario: ${traerRequest.name}</p>
      <p>Nombre de login: ${traerRequest.login}</p>
      <p>Cantidad de Repositorios: ${traerRequest.public_repos}</p>
      <p>Localidad: ${traerRequest.location}</p>
      <p>Tipo de Usuario: ${traerRequest.type}</p>
    `
}

const getRepo = async (user, numeroPaginas, numeroRepositoriosPorPagina) => {
  const traerRequest = await request(user, numeroPaginas, numeroRepositoriosPorPagina)

  traerRequest.repositories.forEach(element => {
    document.querySelector('#columnaNombresRepositorios').innerHTML = `
      ${document.querySelector('#columnaNombresRepositorios').innerHTML}
      <p><a href='${element.html_url}' target='_blank' style="text-decoration:none">${element.name}</a></p>
    `
  })
}

const promesaTimeOut = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(
      scroll({
        top: document.body.scrollHeight,
        behavior: "smooth"
      }))
  }, 1000);
});

document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault()

  const user = document.querySelector('#nombre').value
  const numeroPaginas = document.querySelector('#pagina').value
  const numeroRepositoriosPorPagina = document.querySelector('#repoPagina').value

  document.querySelector('#resultados').innerHTML = `
      <div class='row'>
        <div class='col' id='columnaDatosUsario'>
        </div>
        <div class='col text-end' id='columnaNombresRepositorios'>
          <h4>Nombre de Repositorios</h4>
        </div>
      </div>`

  Promise.all([getUser(user, numeroPaginas, numeroRepositoriosPorPagina), getRepo(user, numeroPaginas, numeroRepositoriosPorPagina), promesaTimeOut()])

})