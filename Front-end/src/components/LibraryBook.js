import {
    Center,
    Text,
    Heading,
    VStack,
    Button,
    Image,
    useToast, 
} from "@chakra-ui/react";
import ReactStars from "react-rating-stars-component";


export default function LibraryBook({ book , fetchData}){
    const bookMovedToast = useToast();
    const moveBook = (book , newSection) => {
        const body = JSON.stringify({
            volume_id : book.volume_id,
            new_state : newSection,      
        });
        fetch("http://0.0.0.0:8000/books/update_book_state",{
            method: "PUT",
            headers:{
                Accept : "application/json",
                "Content-Type":"application/json",
            },
        body:body,
        })
        .then((response) => response.json())
        .then((data) => {
            bookMovedToast({
                title: "Moved",
                description:"Book moved to a different section",
                status:"success",
                duration:3000,
                isClosable:true,
            });  
            console.log("Goin to fetch data again !");
            fetchData();
        });
    };  

    const ratingChanged = (new_rating , book) => {
        const body = JSON.stringify({
            volume_id:book.volume_id,
            new_rating:new_rating,
        });
        fetch("http://0.0.0.0:8000/books/update_rating",{
            method: "PUT",
            headers:{
                Accept : "application/json",
                "Content-Type":"application/json",
            },
        body:body,
        })
        .then((response) => response.json())
        .then((data) => {
            bookMovedToast({
                title: "Moved",
                description:"Book rated sucessfully ! ",
                status:"success",
                duration:3000,
                isClosable:true,
            });  
            fetchData();
        });
    };  
    return (
        <VStack
            maxW = "sm"
            borderWidth="1px"
            borderRaduis = "lg"
            overflow="hidden"
            spacing={8}
            key={book.id}
            padding={4}
        >
            <Image src={book.thumbnail} width={40} height={60} paddingTop={2} />
            <Center>
                <Heading size="sm">{book.title} </Heading>
            </Center>
            {book.state === 0 && !book.rating && (
                <Text fontSize="sm">Rate book ? </Text>
            )}
            {book.state === 0 && (
                <ReactStars
                    count={5}
                    onChange={(new_rating) => ratingChanged(new_rating,book) }
                    size={24}
                    activeColor="#ffd700"
                    value={book.rating}
                    />

            )}
             {book.state === 1 && (
                <Button
                    variant="outline"
                    colorScheme = "red"
                    size="sm"
                    onClick={() => moveBook(book,0)}

                    >
                        Completed Book?
                    </Button>

            )}

            {book.state === 2 && (
                <Button
                    variant="outline"
                    colorScheme = "red"
                    size="sm"
                    onClick={() => moveBook(book,1)}

                    >
                        Purchashed Book?
                    </Button>

            )}



        </VStack>
    );
}
