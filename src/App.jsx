import { Toaster } from 'sonner'
import AppRouter from './router/index'

function App() {
  return (
    <>
      <AppRouter />
      <Toaster theme="dark" position="top-right" />
    </>
  )
}

export default App