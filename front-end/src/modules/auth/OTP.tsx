import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { userService } from "@/services/api/user"
import { AxiosError } from "axios"
import Cookies from "js-cookie"
import { toast } from "@/components/ui/use-toast"


const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})
interface OTPProps {
  activationCode: string;
  activationToken: string;
}
const OTP=()=> {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 const handleVarificationOtp = async (values:OTPProps) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.verifyOtp(values);
      //console.log("OTP verified:", response.data);
      toast({
        title: response.data.message || "OTP verified",
      })
      navigate("/login");
    } catch (err:AxiosError | any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }
  
  function onSubmit(data: z.infer<typeof FormSchema>) {

    const activationObject :OTPProps={
      activationCode:data.pin,
      activationToken:Cookies.get('activation_Token') || ''
    }
     handleVarificationOtp(activationObject);
  }

  return (
    <Form {...form}>
      <h6>EvitalRx</h6>
      <h1 className="text-2xl font-bold">One-Time Password</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>One-Time Password</FormLabel> */}
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your Email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

{error && <p>{error}</p>}
        <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  )
}
export default OTP;