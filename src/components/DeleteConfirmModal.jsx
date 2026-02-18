import { Button } from './ui/button';

export default function DeleteConfirmModal({ isOpen, onConfirm, onCancel, title = "Delete Post" }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-card rounded-3xl p-8 max-w-sm w-full mx-4 border border-white/10 shadow-2xl animate-scale-in space-y-6">
                {/* Icon */}
                <div className="flex items-center justify-center">
                    <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </div>
                </div>

                {/* Text */}
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-heading font-bold text-white">{title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Are you sure you want to delete this post? This action <strong className="text-white">cannot be undone</strong>.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="flex-1 rounded-full border-white/10 text-slate-300 hover:text-white hover:bg-white/5"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1 rounded-full bg-red-600 hover:bg-red-500 text-white font-semibold"
                        onClick={onConfirm}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}
