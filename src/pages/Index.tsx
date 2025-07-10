
import React, { useState, useCallback } from 'react';
import { Upload, Download, Filter, Search, ExternalLink, Calendar, User, Link } from 'lucide-react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import FileUploadZone from '@/components/FileUploadZone';
import LinkTable from '@/components/LinkTable';
import ExportButtons from '@/components/ExportButtons';

interface ChatMessage {
  Date: string;
  User: string;
  Message: string;
}

interface ExtractedLink {
  id: string;
  url: string;
  message: string;
  user: string;
  date: string;
  domain: string;
}

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedLinks, setExtractedLinks] = useState<ExtractedLink[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('');

  const extractUrlsFromText = (text: string): string[] => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
  };

  const getDomainFromUrl = (url: string): string => {
    try {
      return new URL(url).hostname;
    } catch {
      return 'Unknown';
    }
  };

  const processCsvFile = useCallback(async (csvFile: File) => {
    setIsProcessing(true);
    
    Papa.parse(csvFile, {
      header: true,
      encoding: 'UTF-8',
      complete: (results) => {
        const messages = results.data as ChatMessage[];
        const links: ExtractedLink[] = [];
        
        messages.forEach((message, index) => {
          if (message.Message && message.Date && message.User) {
            const urls = extractUrlsFromText(message.Message);
            urls.forEach((url, urlIndex) => {
              links.push({
                id: `${index}-${urlIndex}`,
                url: url.trim(),
                message: message.Message,
                user: message.User,
                date: message.Date,
                domain: getDomainFromUrl(url.trim())
              });
            });
          }
        });

        setExtractedLinks(links);
        toast({
          title: "링크 추출 완료!",
          description: `총 ${links.length}개의 링크를 찾았습니다.`,
        });
        setIsProcessing(false);
      },
      error: (error) => {
        console.error('CSV 파싱 오류:', error);
        toast({
          title: "파일 처리 오류",
          description: "CSV 파일을 읽는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
        setIsProcessing(false);
      }
    });
  }, []);

  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    processCsvFile(uploadedFile);
  };

  const filteredLinks = extractedLinks.filter(link => {
    const matchesSearch = link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         link.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = !selectedUser || link.user === selectedUser;
    return matchesSearch && matchesUser;
  });

  const uniqueUsers = [...new Set(extractedLinks.map(link => link.user))].sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl">
              <Link className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              KakaoLink Extractor
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            카카오톡 채팅 내보내기 파일에서 링크를 자동으로 추출하여 깔끔하게 정리해드립니다
          </p>
        </div>

        {!file && (
          <div className="max-w-2xl mx-auto mb-8">
            <FileUploadZone onFileUpload={handleFileUpload} isProcessing={isProcessing} />
          </div>
        )}

        {extractedLinks.length > 0 && (
          <div className="space-y-6">
            {/* 통계 카드들 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Link className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">총 링크 수</p>
                      <p className="text-2xl font-bold text-blue-700">{extractedLinks.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600 font-medium">참여자 수</p>
                      <p className="text-2xl font-bold text-green-700">{uniqueUsers.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500 rounded-lg">
                      <ExternalLink className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-purple-600 font-medium">고유 도메인</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {new Set(extractedLinks.map(link => link.domain)).size}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500 rounded-lg">
                      <Filter className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-orange-600 font-medium">필터된 결과</p>
                      <p className="text-2xl font-bold text-orange-700">{filteredLinks.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 필터 및 검색 */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  필터 및 검색
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">검색</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="링크, 메시지, 도메인으로 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="user-filter">사용자 필터</Label>
                    <select
                      id="user-filter"
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="">모든 사용자</option>
                      {uniqueUsers.map(user => (
                        <option key={user} value={user}>{user}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 내보내기 버튼들 */}
            <div className="flex justify-center">
              <ExportButtons data={filteredLinks} />
            </div>

            {/* 링크 테이블 */}
            <LinkTable links={filteredLinks} />

            {/* 새 파일 업로드 버튼 */}
            <div className="text-center">
              <Button
                onClick={() => {
                  setFile(null);
                  setExtractedLinks([]);
                  setSearchTerm('');
                  setSelectedUser('');
                }}
                variant="outline"
                className="bg-white hover:bg-gray-50"
              >
                <Upload className="mr-2 h-4 w-4" />
                새 파일 업로드
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
