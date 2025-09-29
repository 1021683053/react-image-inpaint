import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Example } from './Example'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Example />
  </BrowserRouter>
)
