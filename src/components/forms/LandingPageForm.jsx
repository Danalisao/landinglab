import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  title: yup.string().required('Le titre est requis'),
  description: yup.string().required('La description est requise'),
  ctaText: yup.string().required('Le texte du CTA est requis'),
  benefits: yup.array().of(yup.string()).min(1, 'Au moins un avantage est requis'),
  primaryColor: yup.string().required('La couleur primaire est requise'),
  secondaryColor: yup.string().required('La couleur secondaire est requise'),
  industry: yup.string().required('L\'industrie est requise'),
  targetAudience: yup.string().required('Le public cible est requis'),
  mainGoal: yup.string().required('L\'objectif principal est requis')
});

const LandingPageForm = ({ initialValues, onSubmit, submitButtonText = 'Sauvegarder' }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">Titre</label>
          <input
            type="text"
            {...register('title')}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Texte du CTA</label>
          <input
            type="text"
            {...register('ctaText')}
            className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
          />
          {errors.ctaText && <p className="text-red-500 text-sm mt-1">{errors.ctaText.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Avantages</label>
          {initialValues?.benefits?.map((_, index) => (
            <input
              key={index}
              type="text"
              {...register(`benefits.${index}`)}
              className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white"
            />
          ))}
          {errors.benefits && <p className="text-red-500 text-sm mt-1">{errors.benefits.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Couleur primaire</label>
            <input
              type="color"
              {...register('primaryColor')}
              className="mt-1 block w-full h-10 rounded-md"
            />
            {errors.primaryColor && <p className="text-red-500 text-sm mt-1">{errors.primaryColor.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Couleur secondaire</label>
            <input
              type="color"
              {...register('secondaryColor')}
              className="mt-1 block w-full h-10 rounded-md"
            />
            {errors.secondaryColor && <p className="text-red-500 text-sm mt-1">{errors.secondaryColor.message}</p>}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
      >
        {submitButtonText}
      </button>
    </form>
  );
};

export default LandingPageForm;
