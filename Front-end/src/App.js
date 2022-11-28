import{
  Center,
  Heading,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,

} from "@chakra-ui/react"

import {useState , useEffect } from "react";
import {ChakraProvider} from "@chakra-ui/react";
import Discover from "./components/Discover"
import Library from "./components/Library";

function App() {

  const [allBooks , setAllBooks] = useState([]);
  const [refreshData , setRefreshData] = useState(false);

  const fetchData = () => {
    setRefreshData(!refreshData)
  }
  useEffect(()=>{
    fetch("http://0.0.0.0:8000/books")
      .then((Response) => Response.json())
      .then((data) => setAllBooks(data))
  },[refreshData])
  console.log(allBooks);
  return(
  <ChakraProvider>
    <Center bg = "linear-gradient(90deg, rgba(13,30,143,0.5536808473389356) 0%, rgba(9,22,102,1) 0%, rgba(0,0,0,1) 95%);"
    color="white" padding={8}
     >
      <VStack spacing={7}>
        <Tabs variant="soft-rounded" colorScheme="blue"> 
        <Center>
          <TabList>
            <Tab>
              <Heading>Discover</Heading>
            </Tab>
            <Tab>
            <Heading>Library</Heading>
            </Tab>
          </TabList>
        </Center>
          <TabPanels>
            <TabPanel>

              <Discover refreshData={fetchData} /> 
            </TabPanel>
        <TabPanel>
          <Library allBooks={allBooks} refreshData ={fetchData}/>
        </TabPanel>
      </TabPanels>
      </Tabs>
    </VStack>
  </Center>
  </ChakraProvider>
);
}
export default App;
