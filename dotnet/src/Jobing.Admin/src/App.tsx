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
import NewsCategoryList from './pages/NewsCategoryList'
import NewsCategoryForm from './pages/NewsCategoryForm'
import NewsList from './pages/NewsList'
import NewsForm from './pages/NewsForm'
import SettingsList from './pages/SettingsList'
import SettingsForm from './pages/SettingsForm'
import SeoList from './pages/SeoList'
import SeoForm from './pages/SeoForm'
import JobsList from './pages/JobsList'
import JobForm from './pages/JobForm'
import UserList from './pages/UserList'
import UserEdit from './pages/UserEdit'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
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
              <Route path="news-categories" element={<NewsCategoryList />} />
              <Route path="news-categories/create" element={<NewsCategoryForm />} />
              <Route path="news-categories/edit/:id" element={<NewsCategoryForm />} />
              <Route path="news" element={<NewsList />} />
              <Route path="news/create" element={<NewsForm />} />
              <Route path="news/edit/:id" element={<NewsForm />} />
              <Route path="settings" element={<SettingsList />} />
              <Route path="settings/create" element={<SettingsForm />} />
              <Route path="settings/edit/:id" element={<SettingsForm />} />
              <Route path="seo" element={<SeoList />} />
              <Route path="seo/create" element={<SeoForm />} />
              <Route path="seo/edit/:id" element={<SeoForm />} />
              <Route path="jobs" element={<JobsList />} />
              <Route path="jobs/create" element={<JobForm />} />
              <Route path="jobs/edit/:id" element={<JobForm />} />
              <Route path="users" element={<UserList />} />
              <Route path="users/edit/:id" element={<UserEdit />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
