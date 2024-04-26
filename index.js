const express = require('express')
const uuid = require('uuid')
const cors = require('cors')


const port = 3001
const app = express()


app.use(express.json())
app.use(cors())

const orders = []

const checkId = (request, response, next)=>{
    const {id} = request.params
    const index = orders.findIndex(user => user.id === id)

    if(index < 0 ){
        return response.status(404).json({error: "User not found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const checkUrl = (request, response, next)=>{
    console.log(request.method) 
    console.log(request.url) 
    

    next()
}

app.get('/orders', checkUrl,(request, response)=>{
    return response.json({orders})
})

app.post('/orders', checkUrl,(request, response)=>{
    const {order, clientName, price} = request.body
    const status = "Em preparação"
    const newOrder = {id: uuid.v4(), order, clientName, price, status}

    orders.push(newOrder)
    
    return response.status(201).json(newOrder)
})

app.put('/orders/:id', checkId,checkUrl, (request, response)=>{
    const {order, clientName, price} = request.body
    const index = request.orderIndex
    const id = request.orderId
    const updateOrder = {id, order, clientName, price}

    orders[index] = updateOrder
    return response.json({updateOrder})
})

app.delete('/orders/:id', checkId,checkUrl,(request, response)=>{
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.get('/orders/:id', checkId, checkUrl,(request, reponse) =>{
    const index = request.orderIndex
    const viewOrder = orders[index]

    return reponse.json(viewOrder)
})

app.patch ('/orders/:id', checkId, checkUrl,(request, response)=>{
    // const {order, clientName, price} = request.body
    // const id = request.orderId
    // const index = request.orderId

    // const orderReady = {
    //     id,
    //     order: orders[index].order,
    //     clientName: orders[index].clientName,
    //     price: orders[index].price,
    //     status: "pronto"
    // }

    // orders [index] = orderReady

    const id = request.orderId
    const index = request.orderIndex
    const {status} = request.body
  
    orders[index].status = status
   
  
    return response.json(orders[index])
    
    // return response.json(orderReady)
})

console.log('Está dando certo')


app.listen(port, ()=>{
    console.log(`🚀 Serve started on port ${port}`)
})