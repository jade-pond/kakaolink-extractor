
import React, { useState } from 'react';
import { ExternalLink, Calendar, User, MessageSquare, Globe, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface ExtractedLink {
  id: string;
  url: string;
  message: string;
  user: string;
  date: string;
  domain: string;
}

interface LinkTableProps {
  links: ExtractedLink[];
}

type SortField = 'date' | 'user' | 'domain' | 'url';
type SortDirection = 'asc' | 'desc';

const LinkTable: React.FC<LinkTableProps> = ({ links }) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedLinks = [...links].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'date') {
      aValue = new Date(aValue).getTime().toString();
      bValue = new Date(bValue).getTime().toString();
    }

    const result = aValue.localeCompare(bValue);
    return sortDirection === 'asc' ? result : -result;
  });

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "복사 완료",
        description: "클립보드에 복사되었습니다.",
      });
    } catch (err) {
      console.error('복사 실패:', err);
      toast({
        title: "복사 실패",
        description: "클립보드 복사 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-2 font-medium text-gray-700 hover:text-gray-900"
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
        )}
      </div>
    </Button>
  );

  if (links.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <div className="text-gray-500">
            <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">추출된 링크가 없습니다</p>
            <p className="text-sm">다른 검색 조건을 시도해보세요</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          추출된 링크 ({links.length}개)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3">
                  <SortButton field="url">링크</SortButton>
                </th>
                <th className="text-left p-3">
                  <SortButton field="domain">도메인</SortButton>
                </th>
                <th className="text-left p-3">
                  <SortButton field="user">사용자</SortButton>
                </th>
                <th className="text-left p-3">
                  <SortButton field="date">날짜</SortButton>
                </th>
                <th className="text-left p-3">메시지</th>
                <th className="text-center p-3">동작</th>
              </tr>
            </thead>
            <tbody>
              {sortedLinks.map((link, index) => (
                <tr key={link.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm break-all hover:underline"
                      >
                        {link.url.length > 50 ? `${link.url.substring(0, 50)}...` : link.url}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(link.url)}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                  <td className="p-3">
                    <Badge variant="secondary" className="text-xs">
                      {link.domain}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">{link.user}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{formatDate(link.date)}</span>
                    </div>
                  </td>
                  <td className="p-3 max-w-md">
                    <div className="text-sm text-gray-700">
                      {expandedRows.has(link.id) ? (
                        <div>
                          <p className="mb-2">{link.message}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRowExpansion(link.id)}
                            className="text-xs text-blue-600 p-0 h-auto"
                          >
                            접기
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <p className="line-clamp-2">
                            {link.message.length > 100 
                              ? `${link.message.substring(0, 100)}...` 
                              : link.message
                            }
                          </p>
                          {link.message.length > 100 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRowExpansion(link.id)}
                              className="text-xs text-blue-600 p-0 h-auto mt-1"
                            >
                              더보기
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(link.url)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkTable;
