import { useState, useEffect, useCallback } from "react";
import api, { publicApi } from "@/core/api/api";
import {
  SetupFormData,
  LogEntry,
  MigrationStatus,
  LogLevel,
} from "../types/setup";

const INITIAL_DATA: SetupFormData = {
  apiBaseUrl: "http://localhost:8000",
  wsUrl: "ws://localhost:8000/ws",
  dbType: "PostgreSQL",
  dbHost: "localhost",
  dbPort: "5432",
  dbUser: "postgres",
  dbPass: "",
  dbName: "gym_food_db",
  vectorProvider: "Qdrant",
  vectorHost: "http://localhost:6333",
  vectorKey: "",
  vectorCollection: "gym_food_hybird_v1",
  llmProvider: "Gemini",
  llmKey: "",
  llmModel: "gemini-2.5-flash",
  botName: "GymCoach AI",
  welcomeMessage:
    "Xin chào, tôi có thể giúp gì cho lộ trình tập luyện của bạn?",
  language: "Vietnamese",
};

// --- BIẾN TOÀN CỤC ---
let globalLastCheckTime = 0;
let globalCheckPromise: Promise<any> | null = null;

export const useSetupWizard = () => {
  // --- STATE ---
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<SetupFormData>(INITIAL_DATA);
  const [adminForm, setAdminForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMigrationDone, setIsMigrationDone] = useState(false);

  const [stepStatus, setStepStatus] = useState<{
    [key: number]: "pending" | "success" | "error";
  }>({
    1: "pending",
    2: "pending",
    3: "pending",
    4: "pending",
    5: "pending",
    6: "pending",
    7: "pending",
  });

  const [dbInitStatus, setDbInitStatus] =
    useState<MigrationStatus["status"]>("checking");

  // --- HELPERS ---
  const addLog = useCallback((type: LogLevel, message: string) => {
    const entry: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString([], { hour12: false }),
      type,
      message,
    };
    setLogs((prev) => [...prev, entry]);
  }, []);

  const getAuthHeader = () => {
    const key = localStorage.getItem("setup_admin_key");
    return key ? { "x-admin-key": key } : {};
  };

  // --- CORE: SYSTEM STATUS CHECK ---
  useEffect(() => {
    const performCheck = async () => {
      const now = Date.now();

      if (now - globalLastCheckTime < 2000 || globalCheckPromise) {
        setIsCheckingStatus(false);
        return;
      }

      globalLastCheckTime = now;

      try {
        globalCheckPromise = publicApi.get("/api/v2/setup/status");
        const res = await globalCheckPromise;
        const { status, step, message } = res.data;

        // 1. Hoàn thành -> Login (CHỈ REDIRECT NẾU ĐANG Ở TRANG SETUP)
        if (status === "completed") {
          // [FIX] Kiểm tra xem URL hiện tại có phải là /setup không
          const isSetupPage = window.location.hash.includes("/setup");

          if (isSetupPage) {
            alert("Setup already completed. Redirecting to login.");
            localStorage.removeItem("setup_admin_key");
            localStorage.setItem("system_setup_status", "completed");
            window.location.hash = "#/login";
          }
          // Nếu không phải trang setup (ví dụ đang ở /dashboard), thì KHÔNG LÀM GÌ CẢ
          // để tránh redirect loop.
          return;
        }

        // 2. Pending logic (giữ nguyên)
        if (status === "pending") {
          const serverStep = parseFloat(step);

          if (serverStep === 0) {
            localStorage.removeItem("setup_admin_key");
            setCurrentStep(0);
          } else if (serverStep === 4.5) {
            setCurrentStep(4);
            setDbInitStatus("migrated");
            setIsMigrationDone(true);
            setStepStatus((prev) => ({
              ...prev,
              1: "success",
              2: "success",
              3: "success",
              4: "pending",
            }));
            addLog("INFO", "Resume: Waiting for Admin creation.");
          } else {
            const targetStep = Math.floor(serverStep);
            setCurrentStep(targetStep);
            const newStatus = { ...stepStatus };
            for (let i = 1; i < targetStep; i++) {
              // @ts-ignore
              newStatus[i] = "success";
            }
            setStepStatus(newStatus);
            addLog("INFO", `Resuming at Step ${targetStep}: ${message}`);
          }
        }
      } catch (error) {
        console.error("Status check failed", error);
        setCurrentStep(0);
      } finally {
        globalCheckPromise = null;
        setIsCheckingStatus(false);
      }
    };

    performCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- ACTIONS (Giữ nguyên) ---
  const initAdmin = async (key: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      addLog("INFO", "Initializing Admin Key...");
      const res = await api.post("/api/v2/setup/init-admin", {
        admin_secret_key: key,
      });
      if (res.data.status === "success") {
        localStorage.setItem("setup_admin_key", key);
        addLog("SUCCESS", "Admin Key initialized.");
        setTimeout(() => setCurrentStep(1), 500);
        return true;
      }
      return false;
    } catch (error: any) {
      addLog("ERROR", error.response?.data?.detail || "Init failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const testNetwork = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const payload = {
        api_base_url: formData.apiBaseUrl,
        websocket_url: formData.wsUrl,
      };
      await api.post("/api/v2/setup/step1/save", payload, {
        headers: getAuthHeader(),
      });
      addLog("SUCCESS", "Network config saved.");
      setStepStatus((prev) => ({ ...prev, 1: "success" }));
      return true;
    } catch (error: any) {
      addLog(
        "ERROR",
        `Network Error: ${error.response?.data?.detail || error.message}`
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const testDatabase = async (): Promise<boolean> => {
    setIsLoading(true);
    addLog("INFO", `Connecting to ${formData.dbHost}:${formData.dbPort}...`);
    const payload = {
      host: formData.dbHost,
      port: formData.dbPort,
      username: formData.dbUser,
      password: formData.dbPass,
      db_name: formData.dbName,
    };
    try {
      const testRes = await api.post("/api/v2/setup/step2/test", payload, {
        headers: getAuthHeader(),
      });
      addLog("SUCCESS", testRes.data.message);
      await api.post("/api/v2/setup/step2/save", payload, {
        headers: getAuthHeader(),
      });
      addLog("SUCCESS", "Database config saved to .env");
      setStepStatus((prev) => ({ ...prev, 2: "success" }));
      return true;
    } catch (error: any) {
      addLog(
        "ERROR",
        `DB Error: ${error.response?.data?.detail || error.message}`
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyVector = async (): Promise<boolean> => {
    setIsLoading(true);
    addLog("INFO", `Verifying Qdrant at ${formData.vectorHost}...`);
    const payload = {
      host: formData.vectorHost,
      api_key: formData.vectorKey,
      collection_name: formData.vectorCollection,
    };
    try {
      const testRes = await api.post("/api/v2/setup/step3/test", payload, {
        headers: getAuthHeader(),
      });
      if (testRes.data.status === "warning")
        addLog("WARNING", testRes.data.message);
      else addLog("SUCCESS", testRes.data.message);
      await api.post("/api/v2/setup/step3/save", payload, {
        headers: getAuthHeader(),
      });
      addLog("SUCCESS", "Vector config saved.");
      setStepStatus((prev) => ({ ...prev, 3: "success" }));
      return true;
    } catch (error: any) {
      addLog(
        "ERROR",
        `Vector Error: ${error.response?.data?.detail || error.message}`
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkDbSchemaStatus = async () => {
    try {
      const res = await api.get("/api/v2/setup/step4/db-status", {
        headers: getAuthHeader(),
      });
      if (res.data.status === "dirty") {
        setDbInitStatus("dirty");
        addLog("WARNING", res.data.message);
      } else {
        setDbInitStatus("clean");
        addLog("INFO", res.data.message);
      }
    } catch (e) {
      addLog("ERROR", "Failed to check DB status");
    }
  };

  const runMigration = async (forceReset: boolean = false) => {
    setIsLoading(true);
    setDbInitStatus("migrating");
    addLog("INFO", "Executing Database Migration...");
    try {
      const res = await api.post(
        "/api/v2/setup/step4/db-migrate",
        { force_reset: forceReset },
        { headers: getAuthHeader() }
      );
      addLog("SUCCESS", res.data.message);
      setDbInitStatus("migrated");
      setIsMigrationDone(true);
    } catch (error: any) {
      addLog(
        "ERROR",
        `Migration failed: ${error.response?.data?.detail || error.message}`
      );
      setDbInitStatus("dirty");
    } finally {
      setIsLoading(false);
    }
  };

  const skipMigration = () => {
    addLog("WARNING", "Skipping migration manually.");
    setDbInitStatus("migrated");
    setIsMigrationDone(true);
  };

  const createFirstAdmin = async (): Promise<boolean> => {
    setIsLoading(true);
    addLog("INFO", "Creating Root Administrator...");
    try {
      const payload = {
        username: adminForm.username,
        email: adminForm.email,
        password: adminForm.password,
        full_name: adminForm.fullName,
      };
      const res = await api.post("/api/v2/setup/create-first-admin", payload, {
        headers: getAuthHeader(),
      });
      if (res.data.status === "warning") addLog("WARNING", res.data.message);
      else addLog("SUCCESS", res.data.message);
      setStepStatus((prev) => ({ ...prev, 4: "success", 5: "success" }));
      return true;
    } catch (error: any) {
      addLog(
        "ERROR",
        `Create Admin failed: ${error.response?.data?.detail || error.message}`
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const testLlm = async (): Promise<boolean> => {
    setIsLoading(true);
    addLog("INFO", `Testing ${formData.llmProvider}...`);
    const payload = {
      provider: formData.llmProvider,
      api_key: formData.llmKey,
      model_name: formData.llmModel,
    };
    try {
      await api.post("/api/v2/setup/step4/test", payload, {
        headers: getAuthHeader(),
      });
      addLog("SUCCESS", "LLM Connection Verified.");
      await api.post("/api/v2/setup/step4/save", payload, {
        headers: getAuthHeader(),
      });
      addLog("SUCCESS", "LLM Settings Saved.");
      setStepStatus((prev) => ({ ...prev, 6: "success" }));
      return true;
    } catch (error: any) {
      addLog(
        "ERROR",
        `LLM Error: ${error.response?.data?.detail || error.message}`
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const finishSetup = async () => {
    setIsLoading(true);
    addLog("INFO", "Finalizing & Saving General Config...");
    try {
      const payload = {
        bot_name: formData.botName,
        welcome_message: formData.welcomeMessage,
        language: formData.language,
      };
      const saveRes = await api.post("/api/v2/setup/step5/save", payload, {
        headers: getAuthHeader(),
      });
      addLog("SUCCESS", saveRes.data.message);
      const statusRes = await publicApi.get("/api/v2/setup/status");
      if (statusRes.data.status === "completed") {
        addLog("SUCCESS", "System initialization complete. Redirecting...");
        localStorage.removeItem("setup_admin_key");
        localStorage.setItem("system_setup_status", "completed");
        setTimeout(() => {
          window.location.hash = "#/login";
        }, 1500);
      } else {
        addLog("WARNING", "Setup saved but status verification incomplete.");
      }
    } catch (error: any) {
      addLog(
        "ERROR",
        `Finalization failed: ${error.response?.data?.detail || error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const canGoNext = () => {
    if (currentStep === 4)
      return isMigrationDone && stepStatus[4] === "success";
    return stepStatus[currentStep] === "success" || currentStep === 7;
  };

  const quickFinishSetup = async () => {};

  return {
    isCheckingStatus,
    currentStep,
    setCurrentStep,
    formData,
    setFormData,
    adminForm,
    setAdminForm,
    isLoading,
    logs,
    addLog,
    stepStatus,
    dbInitStatus,
    setDbInitStatus,
    isMigrationDone,
    initAdmin,
    testNetwork,
    testDatabase,
    verifyVector,
    checkDbSchemaStatus,
    runMigration,
    skipMigration,
    createAdmin: createFirstAdmin,
    testLlm,
    finishSetup,
    quickFinishSetup,
    canGoNext,
  };
};
