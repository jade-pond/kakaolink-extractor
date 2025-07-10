
import React from 'react';
import { Share2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface ExtractedLink {
  id: string;
  url: string;
  message: string;
  user: string;
  date: string;
  domain: string;
}

interface ShareButtonProps {
  data: ExtractedLink[];
  size?: 'default' | 'sm';
}

const ShareButton: React.FC<ShareButtonProps> = ({ data, size = 'default' }) => {
  const handleShare = async () => {
    const shareText = `카카오톡 링크 추출 결과\n\n총 ${data.length}개의 링크를 발견했습니다.\n\n주요 링크:\n${data.slice(0, 5).map((link, index) => `${index + 1}. ${link.url}`).join('\n')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'KakaoLink Extractor 결과',
          text: shareText,
          url: window.location.href
        });
        
        toast({
          title: "공유 완료",
          description: "결과가 성공적으로 공유되었습니다.",
        });
      } catch (error) {
        console.log('공유 취소됨');
      }
    } else {
      // Fallback: 클립보드에 복사
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "클립보드 복사 완료",
          description: "결과가 클립보드에 복사되었습니다.",
        });
      } catch (error) {
        toast({
          title: "공유 실패",
          description: "공유 기능을 사용할 수 없습니다.",
          variant: "destructive",
        });
      }
    }
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size={size}
      className="gap-2"
    >
      <Share2 className="h-4 w-4" />
      공유
    </Button>
  );
};

export default ShareButton;
