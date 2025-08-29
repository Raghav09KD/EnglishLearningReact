import { Toaster } from "react-hot-toast";
import AllRoutes from "./Routes";
import { MessageProvider } from "./components/MessageProvider/MessageProvider";
import TeacherStudentManagement from "./pages/Users/UsrManagent";
import AdminSignup from "./pages/Users/AdminSignUp";

function App() {



  return (<>
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "8px",
          background: "#333",
          color: "#fff",
        },
      }}
    />
    {/* <TeacherStudentManagement /> */}
    <MessageProvider>
   
      <AllRoutes />
    </MessageProvider>
  </>
  );
}

export default App;