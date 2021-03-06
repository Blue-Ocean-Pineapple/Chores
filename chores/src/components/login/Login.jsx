import {
  Button,
  chakra,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  useToast,
} from '@chakra-ui/react'
import React, { useState, useRef, useEffect } from 'react'
import { FaGoogle } from 'react-icons/fa';
import { FaFacebook } from 'react-icons/fa';
import {  useNavigate } from 'react-router-dom'
import { Card } from '../home/Card'
import DividerWithText from '../home/DividerWithText.jsx';
import { Layout } from '../home/Layout'
import { useAuth } from '../../contexts/AuthContext';
import axios from "axios";

export default function Login({ setIsAuth }) {
  const navigate = useNavigate();
  const { signInWithGoogle, login, signInWithFacebook } = useAuth();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast();

  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const handleLogin = async (e) => {
    try {
      const res = await axios.get('http://localhost:3001/api/users/'+ email);
      console.log('HIT GET USER from User Database', res.data);
      navigate('/'+ res.data.role.toLowerCase())
    } catch(err) {
      console.log('Error while getting user info', err)
    }
  }

  return (
    <Layout>
      <Heading textAlign='center' my={12}>
        Login
      </Heading>
      <Card maxW='md' mx='auto' mt={4}>
        <chakra.form
          onSubmit={async e => {
            e.preventDefault()
            if (!email || !password) {
              toast({
                description: 'Credentials not valid.',
                status: 'error',
                duration: 9000,
                isClosable: true,
              })
              return
            }
            setIsSubmitting(true)
            login(email, password)
              .then(res => {
                console.log('login res', res)
                localStorage.setItem('isAuth', true)
                setIsAuth(true)
              })
              .catch(error => {
                console.log(error.message)
                toast({
                  description: error.message,
                  status: 'error',
                  duration: 9000,
                  isClosable: true,
                })
              })
              .finally(() => {
                 mounted.current && setIsSubmitting(false)
                 handleLogin()
              })
          }}
        >
          <Stack spacing='6'>
            <FormControl id='email'>
              <FormLabel>Email address</FormLabel>
              <Input
                name='email'
                type='email'
                autoComplete='email'
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id='password'>
              <FormLabel>Password</FormLabel>
              <Input
                name='password'
                type='password'
                autoComplete='password'
                value={password}
                required
                onChange={e => setPassword(e.target.value)}
              />
            </FormControl>

            <Button
              type='submit'
              colorScheme='blue'
              size='lg'
              fontSize='md'
              isLoading={isSubmitting}
              onSubmit={handleLogin}
            >
             Log In
            </Button>
          </Stack>
        </chakra.form>
        <HStack justifyContent='space-between' my={4}>
          <Button variant='link' onClick={() => navigate('/register')}>
           Register
          </Button>
        </HStack>
        <DividerWithText my={6}>OR</DividerWithText>
        <Button
          variant='outline'
          isfullwidth="true"
          colorScheme='google'
          leftIcon={<FaGoogle />}
          onClick={() =>
            signInWithGoogle()
              .then(user => {
                console.log('google user', user)
                localStorage.setItem('isAuth', true)
                // navigate('/profile')
              })
              .catch(e => console.log(e.message))
              .finally(() => {
                mounted.current && setIsSubmitting(false)
                handleLogin()
             })
          }
        >
          Sign in with Google
        </Button>

        <Button
          variant='outline'
          isfullwidth="true"
          colorScheme='facebook'
          leftIcon={<FaFacebook />}
          onClick={() =>
            signInWithFacebook()
              .then(user => {
                console.log(user)
                localStorage.setItem('isAuth', true)
                navigate('/profile')
              })
              .catch(e => console.log(e.message))
              .finally(() => {
                mounted.current && setIsSubmitting(false)
                handleLogin()
             })
          }
        >
          Sign in with Facebook
        </Button>
      </Card>
    </Layout>
  )
}
