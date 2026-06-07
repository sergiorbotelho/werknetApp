import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
interface ConfirmationDialogProps {
  title: string;
  description: string;
  loading: boolean;
  openAlertDialog: boolean;
  setOpenAlertDialog: (value: boolean) => void;
  handleExcluir: () => Promise<void>;
}
export function ConfirmationDialog({
  loading,
  openAlertDialog,
  setOpenAlertDialog,
  handleExcluir,
  title,
  description,
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={openAlertDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-2">
            {description}
            <p className="text-gray-400">* Esta ação não pode ser desfeita.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="bg-destructive text-white hover:bg-destructive hover:opacity-60 hover:text-white"
            onClick={() => setOpenAlertDialog(false)}
          >
            Não
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleExcluir}>
            {loading ? "Excluindo..." : "Sim"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
