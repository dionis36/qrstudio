import { useForm } from 'react-hook-form';
import { useWizardStore } from '../store';

export function VCardForm() {
    const { setStep, updatePayload } = useWizardStore();
    const { register, handleSubmit } = useForm();

    const onSubmit = (data: any) => {
        updatePayload(data);
        setStep(3);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input {...register('first_name', { required: true })} className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input {...register('last_name', { required: true })} className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <input {...register('job_title')} className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <input {...register('company')} className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" {...register('email')} className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="tel" {...register('phone')} className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
            </div>

            <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="flex-1 px-4 py-2 border rounded hover:bg-gray-50 font-medium">Back</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">Next: Design</button>
            </div>
        </form>
    );
}
