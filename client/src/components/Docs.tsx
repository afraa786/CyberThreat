import React, { useState } from "react";
import { Navibar } from "./navbar";
import {
  Code,
  Book,
  Terminal,
  Copy,
  CheckCircle,
  ExternalLink,
  Key,
  Globe,
  Shield,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Database,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const APIDocumentation: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(identifier);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const endpoints = [
    {
      method: "POST",
      endpoint: "/predict",
      description: "Analyze a URL for phishing threats",
      parameters: [
        {
          name: "url",
          type: "string",
          required: true,
          description: "The URL to analyze",
        },
      ],
      example: {
        request: `{
  "url": "https://example.com"
}`,
        response: `{
  "prediction": "safe",
  "probabilities": {
    "safe": 0.92,
    "phishing": 0.08
  },
  "confidence": "high",
  "timestamp": "2025-08-27T10:30:00Z"
}`,
      },
    },
  ];

  const codeExamples = [
    {
      language: "Python",
      code: `import requests
import json

url = "http://127.0.0.1:5000/predict"
payload = {
    "url": "https://example.com"
}

response = requests.post(url, json=payload)
result = response.json()

print(f"Prediction: {result['prediction']}")
print(f"Safe probability: {result['probabilities']['safe']}")`,
      id: "python-example",
    },
    {
      language: "JavaScript",
      code: `const analyzeURL = async (targetUrl) => {
  const response = await fetch('http://127.0.0.1:5000/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: targetUrl }),
  });
  
  const data = await response.json();
  return data;
};

// Usage
analyzeURL('https://example.com')
  .then(result => console.log(result))
  .catch(error => console.error('Error:', error));`,
      id: "javascript-example",
    },
    {
      language: "cURL",
      code: `curl -X POST http://127.0.0.1:5000/predict \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`,
      id: "curl-example",
    },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Navibar />

      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => (window.location.href = "/token")}
          className="group flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span>Back to API Tokens</span>
        </button>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="relative">
            <Code className="h-8 w-8 text-emerald-400" />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full"
            />
          </div>
          <h1 className="text-4xl font-bold text-neutral-100">
            API Documentation
          </h1>
        </div>

        <p className="text-neutral-400 text-xl leading-relaxed max-w-4xl">
          Integrate our advanced phishing detection system into your
          applications. Our RESTful API provides real-time URL security analysis
          powered by machine learning algorithms.
        </p>
      </motion.div>

      {/* Quick Start */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <div className="relative rounded-2xl bg-neutral-800/50 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <Zap className="h-6 w-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-neutral-100">
                Quick Start
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-100">
                      Base URL
                    </h3>
                    <p className="text-neutral-400">
                      All API requests should be made to:
                    </p>
                    <code className="block mt-2 p-3 bg-neutral-900 rounded-lg text-emerald-400 font-mono text-sm">
                      http://127.0.0.1:5000
                    </code>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-black flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-100">
                      Content Type
                    </h3>
                    <p className="text-neutral-400">
                      Always include the header:
                    </p>
                    <code className="block mt-2 p-3 bg-neutral-900 rounded-lg text-emerald-400 font-mono text-sm">
                      Content-Type: application/json
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* API Endpoints */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Database className="h-6 w-6 text-emerald-400" />
          <h2 className="text-2xl font-bold text-neutral-100">API Endpoints</h2>
        </div>

        {endpoints.map((endpoint, index) => (
          <div
            key={index}
            className="relative rounded-2xl bg-neutral-800/50 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <span className="px-3 py-1 bg-emerald-500 text-black font-bold rounded-lg text-sm">
                  {endpoint.method}
                </span>
                <code className="text-emerald-400 font-mono text-lg">
                  {endpoint.endpoint}
                </code>
              </div>

              <p className="text-neutral-300 text-lg mb-8">
                {endpoint.description}
              </p>

              {/* Parameters */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-neutral-100 mb-4">
                  Parameters
                </h4>
                <div className="overflow-hidden rounded-xl border border-neutral-600">
                  <table className="w-full">
                    <thead className="bg-neutral-900/50">
                      <tr>
                        <th className="text-left p-4 text-neutral-100 font-semibold">
                          Parameter
                        </th>
                        <th className="text-left p-4 text-neutral-100 font-semibold">
                          Type
                        </th>
                        <th className="text-left p-4 text-neutral-100 font-semibold">
                          Required
                        </th>
                        <th className="text-left p-4 text-neutral-100 font-semibold">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {endpoint.parameters.map((param, paramIndex) => (
                        <tr
                          key={paramIndex}
                          className="border-t border-neutral-600"
                        >
                          <td className="p-4">
                            <code className="text-emerald-400 font-mono">
                              {param.name}
                            </code>
                          </td>
                          <td className="p-4 text-neutral-300">{param.type}</td>
                          <td className="p-4">
                            {param.required ? (
                              <CheckCircle className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <span className="text-neutral-500">Optional</span>
                            )}
                          </td>
                          <td className="p-4 text-neutral-300">
                            {param.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Example */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-lg font-semibold text-neutral-100 mb-4">
                    Request Example
                  </h4>
                  <div className="relative">
                    <pre className="bg-neutral-900 p-4 rounded-xl overflow-x-auto text-sm text-neutral-300 font-mono">
                      {endpoint.example.request}
                    </pre>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          endpoint.example.request,
                          "request-" + index
                        )
                      }
                      className="absolute top-2 right-2 p-2 text-neutral-400 hover:text-emerald-400 transition-colors"
                    >
                      {copiedCode === "request-" + index ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-neutral-100 mb-4">
                    Response Example
                  </h4>
                  <div className="relative">
                    <pre className="bg-neutral-900 p-4 rounded-xl overflow-x-auto text-sm text-neutral-300 font-mono">
                      {endpoint.example.response}
                    </pre>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          endpoint.example.response,
                          "response-" + index
                        )
                      }
                      className="absolute top-2 right-2 p-2 text-neutral-400 hover:text-emerald-400 transition-colors"
                    >
                      {copiedCode === "response-" + index ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Code Examples */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12"
      >
        <div className="flex items-center space-x-3 mb-6">
          <Terminal className="h-6 w-6 text-emerald-400" />
          <h2 className="text-2xl font-bold text-neutral-100">Code Examples</h2>
        </div>

        <div className="space-y-8">
          {codeExamples.map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative rounded-2xl bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/50 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between p-6 border-b border-neutral-700">
                  <h3 className="text-xl font-semibold text-neutral-100">
                    {example.language}
                  </h3>
                  <button
                    onClick={() => copyToClipboard(example.code, example.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-black font-medium rounded-lg hover:bg-emerald-400 transition-colors"
                  >
                    {copiedCode === example.id ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="p-6 overflow-x-auto">
                  <code className="text-neutral-300 font-mono text-sm whitespace-pre">
                    {example.code}
                  </code>
                </pre>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Response Format */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-12"
      >
        <div className="relative rounded-2xl bg-neutral-800/50 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <Book className="h-6 w-6 text-emerald-400" />
              <h2 className="text-2xl font-bold text-neutral-100">
                Response Format
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-neutral-100 mb-4">
                  Response Fields
                </h4>
                <div className="overflow-hidden rounded-xl border border-neutral-600">
                  <table className="w-full">
                    <thead className="bg-neutral-900/50">
                      <tr>
                        <th className="text-left p-4 text-neutral-100 font-semibold">
                          Field
                        </th>
                        <th className="text-left p-4 text-neutral-100 font-semibold">
                          Type
                        </th>
                        <th className="text-left p-4 text-neutral-100 font-semibold">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-neutral-600">
                        <td className="p-4">
                          <code className="text-emerald-400 font-mono">
                            prediction
                          </code>
                        </td>
                        <td className="p-4 text-neutral-300">string</td>
                        <td className="p-4 text-neutral-300">
                          Either "safe" or "phishing"
                        </td>
                      </tr>
                      <tr className="border-t border-neutral-600">
                        <td className="p-4">
                          <code className="text-emerald-400 font-mono">
                            probabilities
                          </code>
                        </td>
                        <td className="p-4 text-neutral-300">object</td>
                        <td className="p-4 text-neutral-300">
                          Probability scores for each classification
                        </td>
                      </tr>
                      <tr className="border-t border-neutral-600">
                        <td className="p-4">
                          <code className="text-emerald-400 font-mono">
                            probabilities.safe
                          </code>
                        </td>
                        <td className="p-4 text-neutral-300">float</td>
                        <td className="p-4 text-neutral-300">
                          Probability that the URL is safe (0.0-1.0)
                        </td>
                      </tr>
                      <tr className="border-t border-neutral-600">
                        <td className="p-4">
                          <code className="text-emerald-400 font-mono">
                            probabilities.phishing
                          </code>
                        </td>
                        <td className="p-4 text-neutral-300">float</td>
                        <td className="p-4 text-neutral-300">
                          Probability that the URL is phishing (0.0-1.0)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Rate Limits & Best Practices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-12"
      >
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative rounded-2xl bg-neutral-800/50 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="h-6 w-6 text-emerald-400" />
                <h3 className="text-xl font-semibold text-neutral-100">
                  Best Practices
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <ArrowRight className="h-4 w-4 text-emerald-400 mt-1 flex-shrink-0" />
                  <p className="text-neutral-300">
                    Always validate URLs before sending requests
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="h-4 w-4 text-emerald-400 mt-1 flex-shrink-0" />
                  <p className="text-neutral-300">
                    Implement proper error handling for network failures
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="h-4 w-4 text-emerald-400 mt-1 flex-shrink-0" />
                  <p className="text-neutral-300">
                    Cache results for frequently analyzed URLs
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <ArrowRight className="h-4 w-4 text-emerald-400 mt-1 flex-shrink-0" />
                  <p className="text-neutral-300">
                    Use HTTPS in production environments
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative rounded-2xl bg-neutral-800/50 p-8 backdrop-blur-sm border border-neutral-700/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-transparent rounded-2xl"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <AlertTriangle className="h-6 w-6 text-emerald-400" />
                <h3 className="text-xl font-semibold text-neutral-100">
                  Error Handling
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-neutral-300 mb-2">
                    Common HTTP status codes:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <code className="text-emerald-400">200</code>
                      <span className="text-neutral-400">Success</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-emerald-400">400</code>
                      <span className="text-neutral-400">Bad Request</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="text-emerald-400">500</code>
                      <span className="text-neutral-400">Server Error</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Support Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        <div className="relative rounded-2xl bg-gradient-to-r from-emerald-500/10 to-emerald-400/10 p-8 backdrop-blur-sm border border-emerald-400/20 shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-neutral-100 mb-4">
              Need Help?
            </h3>
            <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
              Our API is designed to be simple and powerful. If you need
              assistance integrating our phishing detection system, we're here
              to help.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group px-6 py-3 border border-emerald-400 text-emerald-400 font-semibold rounded-xl hover:bg-emerald-400 hover:text-black transition-all duration-300"
              >
                <span className="flex items-center justify-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Contact Support</span>
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default APIDocumentation;
