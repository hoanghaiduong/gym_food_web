import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import { Provider } from "react-redux";
import { persistor, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import LoadingBar from "@/components/ui/LoadingBar";
import { ThemeProvider } from "@/core/contexts/ThemeContext";
import { SidebarProvider } from "@/core/contexts/SidebarContext";
import { UIProvider } from "@/core/contexts/UIContext"; // Đã sửa lại đường dẫn cho đúng chuẩn core
import ToastContainer from "@/components/ui/ToastContainer";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <SidebarProvider>
            <UIProvider>
              {/* Global UI Feedback Components */}
              <LoadingBar />
              <ToastContainer />
              <App />
            </UIProvider>
          </SidebarProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);