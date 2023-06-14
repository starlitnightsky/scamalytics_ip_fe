/* eslint-disable array-callback-return */
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
  Progress,
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
  const [safeProxy, setSafeProxy] = useState<String[]>([])
  const [newRisk, setNewRisk] = useState<RiskType>(initialProxy)
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState('')
  const [progress, setprogress] = useState(0)
  const [total, setTotal] = useState(0)

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
    const tempValue = safeProxy.join('\n')
    setValue(tempValue)
  }, [newRisk])

  useEffect(() => {
    if (!isLoading) {
      setNewRisk(initialProxy)
      if (safeProxy.length === 0) {
        setValue('')
      }
      setprogress(0)
      setTotal(0)
    }
  }, [isLoading])

  const handleClick = async () => {
    if (value === '') return
    const proxyArr = value.split('\n')
    const proxyList: ProxyType[] = []
    for (let i = 0; i < proxyArr.length; i++) {
      const item = proxyArr[i]
      const tempArr = item.split(':')
      if (tempArr.length === 4) {
        const newItem: ProxyType = {
          host: tempArr[0],
          port: tempArr[1],
          username: tempArr[2],
          password: tempArr[3],
        }
        proxyList.push(newItem)
      }
    }
    setTotal(proxyList.length)

    setIsLoading(true)
    for (let i = 0; i < proxyList.length; i++) {
      setprogress(i + 1)
      const checkResponse = await proxyCheck(proxyList[i])
      if (checkResponse.data.status === 'success') {
        const ipAddress = checkResponse.data.origin
        const scamIpResponse = await checkIP(ipAddress)
        if (scamIpResponse.data.risk === 'low') {
          const ipLocationResponse = await ipLocation(ipAddress)
          const newRiskItem: RiskType = {
            ipAddress: ipAddress,
            score: scamIpResponse.data.score,
            status: scamIpResponse.data.risk,
            location: ipLocationResponse.location,
          }
          const newSafeProxy = `${proxyList[i]?.host}:${proxyList[i]?.port}:${proxyList[i]?.username}:${proxyList[i]?.password}`
          safeProxy.push(newSafeProxy)
          setSafeProxy(() => safeProxy)
          setNewRisk(newRiskItem)
        }
      }
    }
    setIsLoading(false)
  }

  const handleClickClear = () => {
    setValue('')
    setSafeProxy([])
    setprogress(0)
    setTotal(0)
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
        {isLoading && <Progress hasStripe value={(progress / total) * 100} />}
        <Flex gap='50px'>
          <Button
            colorScheme='facebook'
            width='200px'
            onClick={handleClick}
            isLoading={isLoading}
            loadingText='A D D'
          >
            A D D
          </Button>
          <Button
            colorScheme='facebook'
            width='200px'
            onClick={handleClickClear}
            isLoading={isLoading}
            loadingText='C L E A R'
          >
            C L E A R
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
