import { signOut } from "next-auth/react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';


function Logout() {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div>
                    <div className='flex p-2 cursor-pointer rounded hover:bg-[#c7c7c7] hover:bg-opacity-5' >
                        <LogoutOutlinedIcon />
                        <span className='pl-3 font-bold text-nowrap' >Logout</span>
                    </div>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Logout</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    Are you sure you want to logout?
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>No</AlertDialogCancel>
                    <AlertDialogAction onClick={() => signOut()} >Yes</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default Logout;