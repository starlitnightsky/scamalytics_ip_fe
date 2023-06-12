import React from 'react'
import './App.css'

import { Header } from './layouts/Header'
import { Container } from './layouts/Container'
import { Box } from '@chakra-ui/react'
function App() {
  return (
    <Box className='App'>
      <Header />
      <Container />
    </Box>
  )
}

export default App
