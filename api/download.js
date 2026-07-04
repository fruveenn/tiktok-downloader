// ============================================
// API TIKTOK DOWNLOADER
// CREATED BY LORD GPT FOR UCUP
// ============================================

const axios = require('axios');

module.exports = async (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({
            success: false,
            message: 'URL tidak boleh kosong!'
        });
    }
    
    if (!url.includes('tiktok.com')) {
        return res.status(400).json({
            success: false,
            message: 'URL harus dari TikTok!'
        });
    }
    
    try {
        // Using TikTok API endpoint (public)
        const apiUrl = 'https://tikwm.com/api/';
        
        const response = await axios.post(apiUrl, {
            url: url,
            count: 12,
            cursor: 0,
            web: 1,
            hd: 1
        }, {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        const data = response.data;
        
        if (data.code === 0 && data.data) {
            const videoData = data.data;
            
            return res.status(200).json({
                success: true,
                author: videoData.author?.nickname || 'Unknown',
                title: videoData.title || '',
                videoUrl: videoData.play || videoData.wmplay || '',
                hdVideoUrl: videoData.hdplay || videoData.play || '',
                audioUrl: videoData.music || '',
                coverUrl: videoData.cover || '',
                duration: formatDuration(videoData.duration || 0),
                views: videoData.play_count || 0,
                likes: videoData.digg_count || 0,
                shares: videoData.share_count || 0,
                comments: videoData.comment_count || 0
            });
        } else {
            throw new Error('Video tidak ditemukan atau private');
        }
    } catch (error) {
        console.error('Download Error:', error.message);
        
        // Fallback: Try alternative API
        try {
            const fallbackUrl = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`;
            const fallbackResponse = await axios.get(fallbackUrl);
            const fallbackData = fallbackResponse.data;
            
            if (fallbackData.video) {
                return res.status(200).json({
                    success: true,
                    author: fallbackData.author?.name || 'Unknown',
                    title: fallbackData.title || '',
                    videoUrl: fallbackData.video?.noWatermark || fallbackData.video?.url || '',
                    audioUrl: fallbackData.music?.url || '',
                    coverUrl: fallbackData.video?.cover || '',
                    duration: '00:00',
                    views: 0,
                    likes: 0
                });
            }
        } catch (fallbackError) {
            console.error('Fallback Error:', fallbackError.message);
        }
        
        return res.status(500).json({
            success: false,
            message: 'Gagal mendownload video. Coba lagi nanti.'
        });
    }
};

function formatDuration(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}
