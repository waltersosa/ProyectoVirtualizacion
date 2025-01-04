import fetch from 'node-fetch';
import { Request, Response as ExpressResponse } from 'express';
import { RequestHandler } from 'express';

export const proxyController = {
  proxyDeviceData: (async (req: Request, res: ExpressResponse) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }

      console.log('Proxying request to:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      res.json(data);
    } catch (error) {
      console.error('Proxy error:', error);
      res.status(500).json({ 
        error: 'Error fetching device data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }) as RequestHandler
}; 