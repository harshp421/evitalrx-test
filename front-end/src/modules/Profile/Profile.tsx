import  { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/userContext'; // Ensure this import path is correct
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/utils';
import { userService } from '@/services/api/user';
import { AxiosError } from 'axios';
import { toast } from '@/components/ui/use-toast';
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  dob: z.string().optional(), // Adjust as needed
  address: z.string().optional(),
  gender: z.string().optional(),
});

const Profile = () => {
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.username || '',
      email: user?.email || '',
      phone: user?.mobile || '',
      dob: user?.dob || '',
      address: user?.address || '',
      gender: user?.gender || '', 
    },
  });
  
  useEffect(() => {
    form.reset({
      name: user?.username || '',
      email: user?.email || '',
      phone: user?.mobile || '',
      dob: user?.dob || '',
      address: user?.address || '',
      gender: user?.gender || '',
    });
  }, [user, form.reset]);

  const updateUser = async (data: any) => {
    try{
      setLoading(true);
      setError(null);
      const response = await userService.updateUser(data);
      setUser(response.data.user);
      form.reset({
        name: response.data.user.username,
        email: response.data.user.email,
        phone: response.data.user.mobile,
        dob: response.data.user.dob,
        address: response.data.user.address,
        gender: response.data.user.gender,
      })
      toast({
        title: response.data.message || "Profile updated successfully",
      })
       // Update form values with new user data using reset
     
    }catch(err : AxiosError | any){
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    }finally{
      setLoading(false);
    }
  }

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    console.log(data);
    // Handle form submission
   // await updateUser(data);
   const userData={
    username:data.name,
      gender:data.gender,
      dob:data.dob,
      address:data.address,
   }
   updateUser(userData);
  };

  return (
    <div className="px-4 space-y-6 md:px-6 pt-6">
      <header className="space-y-1.5">
        <div className="flex items-center space-x-4">
          <img
            src="https://github.com/shadcn.png"
            alt="Avatar"
            width="96"
            height="96"
            className="border rounded-full"
            style={{ aspectRatio: '96/96', objectFit: 'cover' }}
          />
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold">{user?.username}</h1>
          
          </div>
        </div>
      </header>
      <Form {...form}>
      <h1 className="text-2xl font-bold">Profile</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input id="name" placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input id="email" placeholder="Enter your email" type="email" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input id="phone" placeholder="Enter your phone" type="tel" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth</FormLabel>
              <FormControl>
                <Input id="dob" type="date" placeholder="Enter your date of birth" {...field}   value={formatDate(field?.value || "")}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea id="address" placeholder="Enter your address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl>
                <RadioGroup 
                  className="flex space-x-4" 
                  value={field.value} 
                  onValueChange={field.onChange}
                >
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         {error && <p className="error">{error}</p>}
        <Button type="submit" disabled={loading}>
         { loading ? "Updating..." : "Update " }
        </Button>
      </form>
    </Form>
    </div>
  );
};

export default Profile;
