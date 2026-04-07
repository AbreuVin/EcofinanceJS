import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CheckCircle2, XCircle, Loader2, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/api/api";

type Status = "loading" | "success" | "error";

export default function ConfirmEmailPage() {
    const [, navigate] = useLocation();
    const [status, setStatus] = useState<Status>("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
            setStatus("error");
            setMessage("Token não encontrado. O link pode estar incompleto.");
            return;
        }

        api.get(`/users/confirm?token=${encodeURIComponent(token)}`)
            .then((res: { data: { message?: string } }) => {
                setStatus("success");
                setMessage(res.data.message || "Cadastro confirmado com sucesso!");
            })
            .catch((err: { response?: { data?: { message?: string } } }) => {
                setStatus("error");
                setMessage(
                    err.response?.data?.message ||
                    "Não foi possível confirmar o cadastro. O link pode ter expirado."
                );
            });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-10 text-center">

                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="bg-green-700 rounded-xl p-2">
                        <Leaf className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-left">
                        <p className="font-bold text-green-800 text-lg leading-tight">EcoFinance Group</p>
                        <p className="text-xs text-green-600 leading-tight">Gestão de Emissões de GEE</p>
                    </div>
                </div>

                {/* Status */}
                {status === "loading" && (
                    <>
                        <Loader2 className="h-16 w-16 text-green-600 animate-spin mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Confirmando seu cadastro...</h2>
                        <p className="text-gray-500 text-sm">Aguarde um instante.</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Tudo certo!</h2>
                        <p className="text-gray-600 text-sm mb-8">{message}</p>
                        <Button
                            className="w-full bg-green-700 hover:bg-green-800 text-white"
                            onClick={() => navigate("/")}
                        >
                            Ir para o Login
                        </Button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Ops, algo deu errado</h2>
                        <p className="text-gray-600 text-sm mb-8">{message}</p>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => navigate("/")}
                        >
                            Voltar para o Login
                        </Button>
                    </>
                )}

                <p className="text-xs text-gray-400 mt-8">
                    © {new Date().getFullYear()} EcoFinance Group ·{" "}
                    <a
                        href="https://www.grupoecofinance.com.br"
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-600 hover:underline"
                    >
                        grupoecofinance.com.br
                    </a>
                </p>
            </div>
        </div>
    );
}
