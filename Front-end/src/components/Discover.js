import{
    Center,
    Heading,
    VStack,
    useToast,
    HStack,
    Button,
    Input,
    Text,
    SimpleGrid,
    Image,
    Badge,
    
  
  } from "@chakra-ui/react";
import {useState } from 'react';
import { AddIcon } from '@chakra-ui/icons'

import React from "react";

const API_KEY = "AIzaSyBEzkPTX6ugmnTzbdb4mv3-RGF4rAE3jVw";

export default function Discover({refreshData}){

    const [searchQuery , setSearchQuery] = useState("");
    const [searchResults , setSearchResults] = useState([]);

    const bookAddedToast = useToast();

    const onSearchClick = () => {
        fetch(
            `https://www.googleapis.com/books/v1/volumes?q=${searchQuery}&key=${API_KEY}&maxResults=40`
            )
        .then((response) => response.json())
        .then((data) => setSearchResults(data["items"]));

    };
    const addBook = (book_library) => {
        const body = JSON.stringify({
            volume_id: book_library.id,
            title : book_library.volumeInfo.title,
            authors: book_library.volumeInfo.authors?.join(", "),
            thumbnail: book_library.volumeInfo.imageLinks?.thumbnail,
            state:2,
        });
        fetch("http://0.0.0.0:8000/books",{
            method: "POST",
            headers:{
                Accept : "application/json",
                "Content-Type":"application/json",
            },
        body:body
        }).then(response => response.json()).then(data => {
            refreshData()
            bookAddedToast({
                title: "Added",
                description:"Book added to wishlist",
                status:"success",
                duration:3000,
                isClosable:true,
            });
        });
    };


    return(
        <VStack spacing={7} paddingTop={5}>
            <Heading size="lg"> Search Books</Heading>
            <Text>Find new books to add to your libray</Text>
        <HStack spacing={12}>
            <Input width = "600px"
             value={searchQuery}
             onChange = {(e) => setSearchQuery(e.target.value)}
             />  
            <Button colorScheme="red" size="lg" onClick = {onSearchClick}>
                Search book 
                </Button> 
        </HStack>
        {searchResults.length === 0 && (
            <Center> 
                <Heading> You gotta search to see results ! </Heading>    
             </Center>
        )}
        <SimpleGrid columns={4} spacing={8}>
            {searchResults.length !== 0 &&
                searchResults.map((book_library) => {
                    return (
                        <VStack
                            maxW="sm"
                            borderWidth="1px"
                            borderRadius="lg"
                            overflow="hidden"
                            spacing={6}
                            key={book_library.id}
                    >
                        <Image
                            src={book_library.volumeInfo.imageLinks?.thumbnail}
                            width={40}
                            height={60}
                            paddingTop={2}
                        />
                        <Badge borderRadius="full" px="2" colorScheme="teal">
                            {book_library.volumeInfo.categories?.join(",")}
                        </Badge>

                        <VStack>
                            <Badge colorScheme="red">
                                Google Rating : {" "}
                                {book_library.volumeInfo.averageRating
                                  ? book_library.volumeInfo.averageRating
                                  : "N/A"}
                            </Badge>      
                            <Text textAlign="center">
                                Author : {book_library.volumeInfo.authors?.join(" ,")}
                            </Text>

                        </VStack>

                        <VStack>
                          

                        <Center paddingBottom={2}>
                            <Button variant="outline" onClick={() => addBook(book_library)}>
                                <HStack>
                                    <AddIcon w={4} h={4} color="red.500"/>
                                    <Text> Add book </Text>
                                </HStack>
                            </Button>
                        </Center>
                        </VStack>
                     </VStack>

                );
            })}
        </SimpleGrid>
        </VStack>
    );
}

