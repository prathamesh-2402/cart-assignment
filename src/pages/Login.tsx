import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import * as z from "zod"

import { Lock } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "components/ui/card"

import { IFormFields } from "utils/interface";
import CustomForm from "@/components/CustomForm";
import Toast from "@/utils/Toast";
import axios from "axios";

const formSchema = z.object({
  username: z.string().min(1, "Username cannot be empty"),
  password: z.string().min(6, "Password must contain at least 8 character(s)"),
});


const Login = () => {
  let navigate = useNavigate();
  let defaultValues = {
    username: "",
    password: "",
  }
  const [loading, setLoading] = useState(false);

  const onSubmit = async (user: z.infer<typeof formSchema>) => {
    setLoading(true);
    console.log(user);
    try {
      const response = await axios.post('https://dummyjson.com/auth/login', user)
      console.log(response.data)
      localStorage.setItem('token', response?.data?.token);
      localStorage.setItem('name', response?.data?.firstName);
      Toast({ message: "Login Successful", type: "success" });
      navigate('/');
    } catch (error:any) {
      Toast({ message: error.response.data.message, type: "error" })
    } finally {
      setLoading(false);
    }
  }

  const FormFields: Array<IFormFields> = [
    { name: "username", display: "Username", placeholder: "example", type: "text" },
    { name: "password", display: "Password", placeholder: "*******", type: "password" },
  ]

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-[500px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Log in to your account</CardTitle>
          <CardDescription>
            Enter kminchelle and 0lelplR as default credentials.

          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <CustomForm
            FormFields={FormFields}
            defaultValues={defaultValues}
            formSchema={formSchema}
            loading={loading}
            submitButtonText="Sign in"
            submitIcon={<Lock className="mr-2 w-4 h-4" />}
            onSubmit={onSubmit}
          />
        </CardContent>
      </Card>
    </div >
  )
}

export default Login