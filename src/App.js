import { Toaster } from "react-hot-toast";
import AllRoutes from "./Routes";


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
    <AllRoutes />
  </>
  );
}

export default App;
