const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let car = {}

window.addEventListener('DOMContentLoaded', ()=>{
    fetchData()
    if (localStorage.getItem('car')) {
        car = JSON.parse(localStorage.getItem('car'))
        pintarCar()
    }
   // console.log('DOM fully loaded and parsed');
})
cards.addEventListener('click', e =>{
    addCar(e)
})

items.addEventListener('click', e=>{
    
    btnAccion(e)
})

const fetchData = async () =>{
    try {
        const res = await fetch('api.json')
        const data = await res.json()
       // console.log(data)
        pintarCards(data)
    } catch (error) {
        console.log(error)
    }
}


const pintarCards = (data) =>{
    data.forEach(producto => {
     templateCard.getElementById('Titulo-producto').textContent = producto.title
     templateCard.getElementById('precio').textContent = producto.precio
     templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
     templateCard.querySelector('.btn-dark').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

const addCar = e =>{
    //console.log(e.target)
   // console.log(e.target.classList.contains('btn-dark'))
    if (e.target.classList.contains('btn-dark')) {
       //console.log(e.target.parentElement)
       setCar(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCar = objeto => {
   // console.log(objeto)

    const producto ={
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('#Titulo-producto').textContent,
        precio: objeto.querySelector('#precio').textContent,
        cantidad: 1
    }

    if (car.hasOwnProperty(producto.id)) {
        producto.cantidad = car[producto.id].cantidad + 1
    }

    car[producto.id] = {...producto}
    pintarCar()
}

const pintarCar = () =>{
    items.innerHTML = ''

    Object.values(car).forEach(producto=>{
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('car', JSON.stringify(car))
}

const pintarFooter = ()=>{
    footer.innerHTML = ''
    if (Object.keys(car).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`
        return
    }

    const nCantidad = Object.values(car).reduce((acc,{cantidad})=> acc + cantidad,0)
    const nPrecio = Object.values(car).reduce((acc,{cantidad, precio})=> acc + cantidad * precio,0)
    
    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () =>{
        car = {}
        pintarCar()
    })
}

const btnAccion = e =>{
   // console.log(e.target)

    if (e.target.classList.contains('btn-info')) {

      const producto = car[e.target.dataset.id]
      producto.cantidad++
      car[e.target.dataset.id] = {...producto}
      pintarCar()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = car[e.target.dataset.id]
        producto.cantidad--
        
        if (producto.cantidad === 0) {
            delete car[e.target.dataset.id]
        }
      pintarCar()
    }

    e.stopPropagation()
}