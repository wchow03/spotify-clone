import { getProviders, signIn } from "next-auth/react";

function Login({ providers }:{ providers:any }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#252525]">
            {Object.values(providers).map((provider: any) => (
                <div key={provider.name} >
                    <button 
                        onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                        className="group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white"
                    >
                        <span>Login with {provider.name}</span>
                        <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
                    </button>
                </div>
            ))}
        </div>
    );
}   

export default Login;

export async function getServerSideProps() {
    const providers = await getProviders();
    return {
        props: {
            providers
        }
    }
}