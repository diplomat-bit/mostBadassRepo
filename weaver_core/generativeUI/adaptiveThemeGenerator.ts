// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/weaver_core/generativeUI/adaptiveThemeGenerator.ts
================================================================================

```typescript
import { Configuration, OpenAIApi } from "openai";
import { ThemeOptions, createTheme } from '@mui/material/styles';
import { generate } from '@ant-design/colors';
import { PaletteMode } from '@mui/material';
import { AiSuggestionRequest, IAITextCompletion, sendGeminiPrompt } from '../../features/geminiService';
import { systemPromptThemeGenerator, userPromptTheme } from '../../ai/promptLibrary';

interface ThemeGeneratorOptions {
    primaryColor?: string;
    secondaryColor?: string;
    darkMode?: boolean;
    fontFamily?: string;
    borderRadius?: number;
    spacingUnit?: number;
    contrastSensitivity?: number;
    styleGuideURL?: string;
    themeDescription?: string;
}

interface ColorPalette {
    [key: string]: string;
}

// Utility function to generate shades of a color using Ant Design's color generation algorithm
const generateColorPalette = (baseColor: string): ColorPalette => {
    const colors = generate(baseColor);
    const palette: ColorPalette = {};
    colors.forEach((color, index) => {
        palette[`color${index + 1}`] = color;
    });
    return palette;
};

const adjustContrastColor = (hexColor: string, factor: number) => {
    hexColor = hexColor.replace("#", "");
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);

    const newR = Math.max(0, Math.min(255, Math.round(r + (255 - r) * factor)));
    const newG = Math.max(0, Math.min(255, Math.round(g + (255 - g) * factor)));
    const newB = Math.max(0, Math.min(255, Math.round(b + (255 - b) * factor)));

    const toHex = (c: number) => {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    return "#" + toHex(newR) + toHex(newG) + toHex(newB);
};

// Main function to generate a MUI theme based on the provided options
const generateMUITheme = async (options: ThemeGeneratorOptions): Promise<ThemeOptions> => {
    const {
        primaryColor = '#3f51b5', // Default primary color
        secondaryColor = '#f50057', // Default secondary color
        darkMode = false, // Default to light mode
        fontFamily = 'Roboto, sans-serif', // Default font family
        borderRadius = 4, // Default border radius in pixels
        spacingUnit = 8, // Default spacing unit in pixels
        contrastSensitivity = 0.2, // Adjusts the contrast of generated colors.
        styleGuideURL, // URL to an existing style guide (optional)
        themeDescription, // Description of the desired theme.
    } = options;

    const mode: PaletteMode = darkMode ? 'dark' : 'light';

    const primaryPalette = generateColorPalette(primaryColor);
    const secondaryPalette = generateColorPalette(secondaryColor);

    let aiPalette: { [key: string]: string } = {};
    if (themeDescription) {
        //Use Gemini to generate the style guide, aiPalette, and the updated font.
        const aiPrompt: AiSuggestionRequest = {
            model: "gemini-1.5-pro-latest",
            prompt: userPromptTheme(themeDescription, primaryColor, secondaryColor, mode),
            systemPrompt: systemPromptThemeGenerator,
        }
        let aiResult = await sendGeminiPrompt(aiPrompt);
        console.log(`AI generated theme information: ${aiResult.text}`);

        try {
            const aiJson = JSON.parse(aiResult.text)
            //Make sure the aiJson has all the correct properties.
            if (aiJson.aiPalette && aiJson.fontFamily) {
                aiPalette = aiJson.aiPalette;
                //Update the font with the AI font suggestions.
                options.fontFamily = aiJson.fontFamily;
            }
            else {
                console.log(`The aiJson did not have the aiPalette or fontFamily, continuing without AI palette.`);
            }
        }
        catch (e) {
            console.error(`Error parsing AI-generated theme information: ${e}, continuing without AI palette.`);
        }
    }

    const themeOptions: ThemeOptions = {
        palette: {
            mode,
            ...(aiPalette ? { ...aiPalette } : {}),
            primary: {
                main: primaryColor,
                ...primaryPalette,
                contrastText: mode === 'dark' ? '#fff' : '#000',
            },
            secondary: {
                main: secondaryColor,
                ...secondaryPalette,
                contrastText: mode === 'dark' ? '#fff' : '#000',
            },
            background: {
                default: mode === 'dark' ? '#303030' : '#fafafa',
                paper: mode === 'dark' ? '#424242' : '#fff',
            },
            text: {
                primary: mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.87)',
                secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            },
            error: {
                main: '#f44336',
            },
            warning: {
                main: '#ff9800',
            },
            info: {
                main: '#2196f3',
            },
            success: {
                main: '#4caf50',
            },
        },
        typography: {
            fontFamily,
        },
        shape: {
            borderRadius,
        },
        spacing: spacingUnit,
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        borderRadius: borderRadius * 1.5,
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius,
                        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        boxShadow: '0px 1px 3px rgba(0,0,0,0.2)',
                    },
                },
            },
        },
    };

    return themeOptions;
};

export default generateMUITheme;
```