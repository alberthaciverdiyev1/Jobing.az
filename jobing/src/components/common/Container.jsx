import React from 'react'

const Container = ({children}) => {
  return (
    <div className='container mx-auto bg-black p-5'>
      {children}
    </div>
  )
}

export default Container
