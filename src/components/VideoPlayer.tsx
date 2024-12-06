import React from 'react';
import type { Lesson } from '../hooks/useLessons';

interface VideoPlayerProps {
  lesson: Lesson | null;
}

// Função para normalizar o texto (remover acentos e converter para minúsculo)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function VideoPlayer({ lesson }: VideoPlayerProps) {
  console.log('VideoPlayer lesson:', lesson);

  if (!lesson) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Selecione uma aula para começar</p>
      </div>
    );
  }

  if (!lesson.video_id) {
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Vídeo não disponível</p>
      </div>
    );
  }

  const videoFonte = normalizeText(lesson.video_fonte || '');
  console.log('Video source:', videoFonte);
  console.log('Video ID:', lesson.video_id);

  if (videoFonte === 'youtube') {
    // Se o video_id já é uma URL completa do YouTube, extrai o ID
    const videoId = lesson.video_id.includes('youtube.com') 
      ? lesson.video_id.split('v=')[1]?.split('&')[0] 
      : lesson.video_id;

    const videoUrl = `https://www.youtube.com/embed/${videoId}`;
    console.log('YouTube URL:', videoUrl);

    return (
      <div className="aspect-video">
        <iframe
          className="w-full h-full rounded-lg"
          src={videoUrl}
          title={lesson.descricao}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (videoFonte === 'vimeo') {
    // Se o video_id já é uma URL completa do Vimeo, extrai o ID
    const videoId = lesson.video_id.includes('vimeo.com') 
      ? lesson.video_id.split('/').pop() 
      : lesson.video_id;

    const videoUrl = `https://player.vimeo.com/video/${videoId}`;
    console.log('Vimeo URL:', videoUrl);

    return (
      <div className="aspect-video">
        <iframe
          className="w-full h-full rounded-lg"
          src={videoUrl}
          title={lesson.descricao}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Se chegou aqui, significa que video_fonte não é nem youtube nem vimeo
  console.log('Invalid video source:', videoFonte);
  return (
    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">
        Formato de vídeo não suportado: {lesson.video_fonte} 
        (normalizado: {videoFonte})
      </p>
    </div>
  );
}
