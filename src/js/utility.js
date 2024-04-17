import bcrypt from 'bcryptjs';
import {customSalt} from "./../settings";
import CryptoJS from "crypto-js";

export const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return `${hours}:${minutes}:${second}`;
  }

  export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  }

  export const comparePassword = async (password, hash) => {
    return password === hash
  };

  
  export const hashPassword = async (password) => {
   return CryptoJS.SHA256(password).toString(
    CryptoJS.enc.Hex
  );
  };
  