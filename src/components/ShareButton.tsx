
import React, { useState } from 'react';
import { Share2, Copy, Mail, MessageCircle, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const shareText = `카카오톡 링크 추출 결과\n\n총 ${data.length}개의 링크를 발견했습니다.\n\n주요 링크:\n${data.slice(0, 5).map((link, index) => `${index + 1}. ${link.url}`).join('\n')}`;
  
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "클립보드 복사 완료",
        description: "결과가 클립보드에 복사되었습니다.",
      });
    } catch (error) {
      toast({
        title: "복사 실패",
        description: "클립보드 복사에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent('카카오톡 링크 추출 결과');
    const body = encodeURIComponent(shareText);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleKakaoTalkShare = () => {
    // 카카오톡 공유 기능 (실제로는 클립보드로 복사)
    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: "카카오톡 공유 준비 완료",
        description: "클립보드에 복사되었습니다. 카카오톡에 붙여넣기 하세요.",
      });
    });
  };

  const handleNotionShare = () => {
    // Notion 형태로 포맷팅
    const notionText = `# 카카오톡 링크 추출 결과\n\n**총 ${data.length}개의 링크 발견**\n\n## 링크 목록\n\n${data.map((link, index) => `${index + 1}. [${link.domain}](${link.url}) - ${link.user} (${link.date})`).join('\n')}`;
    
    navigator.clipboard.writeText(notionText).then(() => {
      toast({
        title: "Notion 포맷으로 복사 완료",
        description: "Notion 페이지에 붙여넣기 하세요.",
      });
    });
  };

  const handleNativeShare = async () => {
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
      handleCopyToClipboard();
    }
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          공유
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyToClipboard} className="gap-2">
          <Copy className="h-4 w-4" />
          클립보드에 복사
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmailShare} className="gap-2">
          <Mail className="h-4 w-4" />
          이메일로 공유
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleKakaoTalkShare} className="gap-2">
          <MessageCircle className="h-4 w-4" />
          카카오톡으로 공유
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleNotionShare} className="gap-2">
          <FileText className="h-4 w-4" />
          Notion 포맷으로 복사
        </DropdownMenuItem>
        {navigator.share && (
          <DropdownMenuItem onClick={handleNativeShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            기본 공유
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareButton;
