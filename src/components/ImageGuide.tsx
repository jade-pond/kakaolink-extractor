
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const ImageGuide: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    {
      src: '/lovable-uploads/0ff121d0-d63b-495e-8938-1522ecd8ff0f.png',
      alt: '카카오톡 채팅방에서 공유 버튼 클릭하는 모습'
    },
    {
      src: '/lovable-uploads/a72e590d-6f50-4969-b382-1f67435b0d44.png',
      alt: '채팅방 설정에서 텍스트 파일로 저장 선택'
    },
    {
      src: '/lovable-uploads/4c157856-d520-4165-9f17-1ee43c15eea9.png',
      alt: '파일명 설정 및 저장 위치 선택'
    },
    {
      src: '/lovable-uploads/80ce6680-d0a9-4b4a-b1f7-664aef1873e7.png',
      alt: '대화내용 내보내기 완료 확인'
    }
  ];

  return (
    <div className="mt-4">
      <h5 className="text-sm font-medium text-blue-900 mb-3">📱 단계별 가이드:</h5>
      <div className="grid grid-cols-2 gap-3">
        {images.map((image, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <div className="cursor-pointer group">
                <img 
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-24 object-cover rounded-lg border border-blue-200 transition-all duration-200 group-hover:shadow-md group-hover:scale-105"
                />
                <p className="text-xs text-blue-600 mt-1 text-center">단계 {index + 1}</p>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0">
              <div className="relative">
                <img 
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-auto max-h-[85vh] object-contain"
                />
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  단계 {index + 1}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};

export default ImageGuide;
