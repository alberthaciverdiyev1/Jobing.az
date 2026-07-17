import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppLayout } from './components/AppLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CityList from './pages/CityList'
import CityForm from './pages/CityForm'
import FilterList from './pages/FilterList'
import FilterForm from './pages/FilterForm'
import CategoryList from './pages/CategoryList'
import CategoryForm from './pages/CategoryForm'
import PostList from './pages/PostList'
import PostForm from './pages/PostForm'
import UserList from './pages/UserList'
import UserEdit from './pages/UserEdit'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="cities" element={<CityList />} />
                  <Route path="cities/create" element={<CityForm />} />
                  <Route path="cities/edit/:id" element={<CityForm />} />
                  <Route path="filters" element={<FilterList />} />
                  <Route path="filters/create" element={<FilterForm />} />
                  <Route path="filters/edit/:id" element={<FilterForm />} />
                  <Route path="blog-categories" element={<CategoryList />} />
                  <Route path="blog-categories/create" element={<CategoryForm />} />
                  <Route path="blog-categories/edit/:id" element={<CategoryForm />} />
                  <Route path="blog-posts" element={<PostList />} />
                  <Route path="blog-posts/create" element={<PostForm />} />
                  <Route path="blog-posts/edit/:id" element={<PostForm />} />
                  <Route path="users" element={<UserList />} />
                  <Route path="users/edit/:id" element={<UserEdit />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
