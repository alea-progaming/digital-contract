import { Plus } from "lucide-react";

export default function CreateContract() {
  return (
    <div className="flex flex-col justify-center items-center p-10 bg-white m-auto text-green-700 w-100 h-100 space-y-4 rounded-2xl border-4 border-green-700">
      <Plus className="w-25 h-25" />
      <p className="text-3xl">Create Contract</p>
    </div>
  );
}
