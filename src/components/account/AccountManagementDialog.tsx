import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog';
import { AccountManagement } from '@/components/account/AccountManagement';

interface AccountManagementDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AccountManagementDialog({ open, onOpenChange }: AccountManagementDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden p-0">
                <div className="overflow-y-auto p-6">
                    <AccountManagement />
                </div>
            </DialogContent>
        </Dialog>
    );
}
