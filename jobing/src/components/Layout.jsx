import { Outlet } from 'react-router-dom'

// Components
import Header from './common/Header'

const Layout = () => {
    return (
      <>
        <Header />
        <Outlet />
      </>
    )
  }
  
  export default Layout