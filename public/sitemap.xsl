<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #333; margin: 40px; background: #fafafa; }
          h1 { color: #1a1a1a; margin-bottom: 5px; font-weight: 600; }
          p { margin-top: 0; color: #666; font-size: 13px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
          th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #efefef; }
          th { background-color: #f8f9fa; font-weight: 600; color: #444; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
          tr:last-child td { border-bottom: none; }
          tr:hover { background-color: #fdfdfd; }
          a { color: #2563eb; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .tag { display: inline-block; padding: 2px 6px; background: #eff6ff; color: #2563eb; border-radius: 4px; font-size: 11px; margin-right: 4px; margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p>This is an XML Sitemap, meant for consumption by search engines like Google and Bing.</p>
        <table>
          <thead>
            <tr>
              <th>URL</th>
              <th>Alternates (hreflang)</th>
              <th>Last Modified</th>
              <th>Change Freq</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td>
                  <a href="{sitemap:loc}">
                    <xsl:value-of select="sitemap:loc"/>
                  </a>
                </td>
                <td>
                  <xsl:for-each select="*['xhtml:link' = name()]">
                    <span class="tag"><xsl:value-of select="@hreflang"/></span>
                  </xsl:for-each>
                </td>
                <td><xsl:value-of select="sitemap:lastmod"/></td>
                <td><xsl:value-of select="sitemap:changefreq"/></td>
                <td><xsl:value-of select="sitemap:priority"/></td>
              </tr>
            </xsl:for-each>
          </tbody>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
