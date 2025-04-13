import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import { NotificationProvider } from './contexts/NotificationContext'
import { UserProvider } from './contexts/UserContext'
import { BlogProvider } from './contexts/BlogContext'

const queryClient = new QueryClient()
createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <BlogProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </BlogProvider>
    </UserProvider>
  </QueryClientProvider>
)
