import { useEffect } from "react";
import { getHealth } from "../services/api";

useEffect(() => {
  getHealth()
    .then((data) => console.log(data))
    .catch(console.error);
}, []);