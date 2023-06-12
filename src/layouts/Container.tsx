/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'

import { checkIP, ipLocation, proxyCheck } from '../service'

import {
  Flex,
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
  useToast,
  Image,
  Spinner,
  Textarea,
} from '@chakra-ui/react'

type RiskType = {
  ipAddress: string
  score: string
  status: string
  location: any
}

type ProxyType = {
  host: string
  port: string
  username: string
  password: string
}

const initialProxy: RiskType = {
  ipAddress: '',
  score: '',
  status: '',
  location: {},
}

const backColor: any = {
  'very high': 'red',
  high: 'tomato',
  medium: 'darkorange',
  low: 'green',
}

export const Container = () => {
  const [riskList, setRiskList] = useState<RiskType[]>([])
  const [newRisk, setNewRisk] = useState<RiskType>(initialProxy)
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState('')

  const toast = useToast()

  useEffect(() => {
    if (newRisk.ipAddress === '') return
    const newList = [...riskList]
    newList.push(newRisk)
    setRiskList(newList)
    toast({
      title: 'Success',
      description: 'New proxy added successfully!',
      status: 'success',
      position: 'top-right',
      duration: 5000,
      isClosable: true,
    })
  }, [newRisk])

  useEffect(() => {
    if (!isLoading) {
      setValue('')
      setNewRisk(initialProxy)
    }
  }, [isLoading])
  const handleClick = async () => {
    const proxyArr = value.split('\n')
    const proxyList = proxyArr.map((item) => {
      const tempArr = item.split(':')
      const newItem: ProxyType = {
        host: tempArr[0],
        port: tempArr[1],
        username: tempArr[2],
        password: tempArr[3],
      }
      return newItem
    })

    setIsLoading(true)
    for (let i = 0; i < proxyList.length; i++) {
      const checkResponse = await proxyCheck(proxyList[i])
      if (checkResponse.data.status === 'success') {
        const ipAddress = checkResponse.data.origin
        const scamIpResponse = await checkIP(ipAddress)
        const ipLocationResponse = await ipLocation(ipAddress)
        console.log(scamIpResponse)
        const newRiskItem: RiskType = {
          ipAddress: ipAddress,
          score: scamIpResponse.data.score,
          status: scamIpResponse.data.risk,
          location: ipLocationResponse.location,
        }
        setNewRisk(newRiskItem)
      }
    }

    setIsLoading(false)
  }

  return (
    <Flex direction='column' color='white' width='70%' gap='30px'>
      <Flex direction='column' gap='20px'>
        <Text fontSize='2xl'>Proxy List</Text>
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={7}
        />
        <Flex gap='50px'>
          <Button colorScheme='facebook' width='200px' onClick={handleClick}>
            A D D
          </Button>
          {isLoading && (
            <Flex>
              <Spinner thickness='4px' size='lg' speed='0.65s' />
            </Flex>
          )}
        </Flex>
      </Flex>
      <Flex direction='column' gap='20px' marginBottom={'50px'}>
        <Text fontSize='2xl'>Proxy List</Text>
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th fontSize='lg' color='gray.100'>
                  No
                </Th>
                <Th fontSize='lg' color='gray.100'>
                  IP Address
                </Th>
                <Th fontSize='lg' color='gray.100'>
                  Risk Score
                </Th>
                <Th fontSize='lg' color='gray.100'>
                  Risk Status
                </Th>
                <Th fontSize='lg' color='gray.100'>
                  Region
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {riskList.map((proxyItem: RiskType, index: number) => {
                return (
                  <Tr key={proxyItem.ipAddress}>
                    <Td>{index + 1}</Td>
                    <Td>{proxyItem.ipAddress}</Td>
                    <Td>{proxyItem.score}</Td>
                    <Td>
                      <Badge
                        bgColor={backColor[proxyItem.status]}
                        fontSize='lg'
                        paddingY='5px'
                        paddingX='15px'
                        textColor='gray.200'
                      >
                        {proxyItem.status}
                      </Badge>
                    </Td>
                    <Td>
                      <Flex gap='10px'>
                        <Image
                          width='40px'
                          height='20px'
                          src={proxyItem.location.country_flag}
                          alt='country_flag'
                        />
                        <Text>{`${proxyItem.location.city}, ${proxyItem.location.country_code2}`}</Text>
                      </Flex>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </Flex>
  )
}
