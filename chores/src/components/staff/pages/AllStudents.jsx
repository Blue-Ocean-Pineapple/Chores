import React from 'react';
import axios from 'axios';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Heading,
  Button,
  Box
} from '@chakra-ui/react'

export default function AllStudents ({ students }) {

  const handleDeactivateStudent = (e) => {
    e.preventDefault();
    // console.log('howdy delete?', e.target.getAttribute("id"));
    let obj = students.find(obj => obj._id === e.target.getAttribute("id"));
    console.log('obj??', obj._id);
    axios.put('/staff/deactivateStudentOrStaff', obj)
    .then((response) => {
      console.log('response data:', response);
    })
    .catch((err) => {
      console.log('submit err:', err);
    })
  }

  const handleActivateStudent = (e) => {
    e.preventDefault();
    // console.log('howdy delete?', e.target.getAttribute("id"));
    let obj = students.find(obj => obj._id === e.target.getAttribute("id"));
    // console.log('obj??', obj);
    axios.put('/staff/addStaffOrStud', obj)
    .then((response) => {
      console.log('response data:', response);
    })
    .catch((err) => {
      console.log('submit err:', err);
    })
  }

  return (
    <Box bg="#8CC0DE" mt={10} mx="auto"  border="1px solid" borderColor='#8CC0DE' width="90vw" borderRadius="10">
      <TableContainer width="80vw" mx="auto">
        <Heading as='h2' size='xl' mt={10} mb={5}>Active</Heading>
        <Table variant='striped'>
          <Thead className='activestudent'>
            <Tr variant='striped'>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Deactivate</Th>
              <Th isNumeric>ID</Th>
            </Tr>
          </Thead>

          <Tbody>
            <Tr variant='striped'>
              <Th>Esther Kuang</Th>
              <Th>estar@gmail.com</Th>
              <Th>
                <Button _hover={{ bg: "#9CB4CC" }}>Select</Button>
              </Th>
              <Th isNumeric>62BF421DD362892067E39D93</Th>
            </Tr>
          </Tbody>
          <Tbody>
            <Tr variant='striped'>
              <Th>Hansol Ji</Th>
              <Th>kimchi@gmail.com</Th>
              <Th>
                <Button _hover={{ bg: "#9CB4CC" }}>Select</Button>
              </Th>
              <Th isNumeric>62BF421DD362892067E99VVJ</Th>
            </Tr>
          </Tbody>
          {
            students.map((person, i) => {
              if (person.active) {
                return (
                  <Tbody key={i}>
                    <Tr variant='striped'>
                      <Th>{person.name}</Th>
                      <Th>{person.email}</Th>
                      <Th>
                        <Button _hover={{ bg: "#9CB4CC" }} id={person._id} onClick={(e) => handleDeactivateStudent(e)}>Select</Button>
                      </Th>
                      <Th isNumeric>{person._id}</Th>
                    </Tr>
                  </Tbody>
                )
              }
            })
          }
        </Table>

        <Heading as='h2' size='xl' mt={10} mb={5}>Inactive</Heading>
        <Table variant='striped'>
          <Thead className='inactivestudent'>
            <Tr variant='striped'>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Activate</Th>
              <Th isNumeric>ID</Th>
            </Tr>
          </Thead>

          <Tbody>
            <Tr variant='striped'>
              <Th>Spencer Han</Th>
              <Th>lesson9@gmail.com</Th>
              <Th>
                <Button _hover={{ bg: "#9CB4CC" }}>Activate</Button>
              </Th>
              <Th isNumeric>62BF421DD3628920679DK393</Th>
            </Tr>
          </Tbody>
          <Tbody>
            <Tr variant='striped'>
              <Th>Fan Zhang</Th>
              <Th>fanfan@gmail.com</Th>
              <Th>
                <Button _hover={{ bg: "#9CB4CC" }}>Activate</Button>
              </Th>
              <Th isNumeric>62BF421DD36289200SJE9393</Th>
            </Tr>
          </Tbody>
          {
            students.map((person, i) => {
              if (!person.active) {
                return (
                  <Tbody key={i}>
                    <Tr variant='striped'>
                      <Th>{person.name}</Th>
                      <Th>{person.email}</Th>
                      <Th>
                        <Button _hover={{ bg: "#9CB4CC" }} id={person._id} onClick={(e) => handleActivateStudent(e)}>Activate</Button>
                      </Th>
                      <Th isNumeric>{person._id}</Th>
                    </Tr>
                  </Tbody>
                )
              }
            })
          }
        </Table>
      </TableContainer>
    </Box>
  )
}
// db.users.insertOne({
//   uid: "3RzRikHOkAZhsib4tje4USZliswe",
//   name: "howdy",
//   email: "testing@test.com",
//   age: 223,
//   address: "123344 sesame street",
//   city: "sesame city",
//   state: "sesame",
//   phone: "1234567891",
//   role: "student",
//   organization: "sesameeeee",
//   active: "true"
// });