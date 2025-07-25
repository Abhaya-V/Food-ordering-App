import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const OrderSuccess = () => {
    const location = useLocation()
      const orderId = location.state?.order_id
  return (
    <div className='container text-center mt-3'>
        <h1 className='text-success fw-bold'>PAYMENT SUCCESSFULL !</h1>
        <p className='lead'>Thank you for your order </p>
        {orderId && <p><strong>ORDER ID :</strong>{orderId}</p>} 
        <Link to="/" className='btn btn-primary mt-3'>Back To Home</Link>     
    </div>
  )
}

export default OrderSuccess
