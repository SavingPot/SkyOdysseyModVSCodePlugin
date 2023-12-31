import { isDefined } from "@vscode/test-electron/out/util";
import { TextDecoder, TextEncoder } from "node:util";
import { type } from "os";
import * as vscode from "vscode";
import { Uri, Terminal } from "vscode";
import * as fs from "fs";
import * as pathUtil from "path";
import * as sidebar from "./sidebar";
import * as joc from "./joc";
import * as child from "child_process";
import { TextureSettings046_Texture } from "./json_objects/texture_settings/0.4.6";
import { ChildProcess } from "node:child_process";
import { resolve } from "node:path";
import { platform } from "node:os";

var childProcess: ChildProcess | undefined;

//TODO: Do unity-code-snippets  by myself?
//TODO: Allows users to set if there should be space in exported json files
//TODO: Auto install Debugger mod for the game version

export function activate(context: vscode.ExtensionContext) {
  //TODO: Complete
  if (!hasWorkspace()) {
  }

  //注册侧边栏面板的实现
  const sidebarProject = new sidebar.ProjectEntryList();
  vscode.window.registerTreeDataProvider(
    "sky-odyssey-mod-dev_project",
    sidebarProject
  );
  //注册侧边栏面板的实现
  const sidebarDebug = new sidebar.BuildEntryList();
  vscode.window.registerTreeDataProvider(
    "sky-odyssey-mod-dev_debug",
    sidebarDebug
  );

  //注册侧边栏面板的实现
  const sidebarRelease = new sidebar.ReleaseEntryList();
  vscode.window.registerTreeDataProvider(
    "sky-odyssey-mod-dev_release",
    sidebarRelease
  );

  //注册侧边栏面板的实现
  const sidebarGit = new sidebar.GitEntryList();
  vscode.window.registerTreeDataProvider("sky-odyssey-mod-dev_git", sidebarGit);

  let syncDisposable = vscode.commands.registerCommand(
    "sky-odyssey-mod-dev.sync",
    () => {
      var editor = vscode.window.activeTextEditor;
      if (editor && editor.selection && editor.selection.active) {
        vscode.window
          .showInputBox({
            placeHolder: "例: int string uint byte float Vector2", // 在输入框内的提示信息
            prompt: "变量类型", // 在输入框下方的提示信息
          })
          .then((type) => {
            vscode.window
              .showInputBox({
                placeHolder: "例: health hunger thirst time speed", // 在输入框内的提示信息
                prompt: "变量名", // 在输入框下方的提示信息
              })
              .then((name) => {
                editor?.edit((edit: any) => {
                  edit.insert(
                    editor?.selection.active,
                    `[SyncGetter] ${type} ${name}_get() => default; [SyncSetter] void ${name}_set(${type} value) { }\n[Sync] public ${type} ${name} { get => ${name}_get(); set => ${name}_set(value); }`
                  );
                });
              });
          });
      }
    }
  );

  let syncStaticDisposable = vscode.commands.registerCommand(
    "sky-odyssey-mod-dev.syncStatic",
    () => {
      var editor = vscode.window.activeTextEditor;
      if (editor && editor.selection && editor.selection.active) {
        vscode.window
          .showInputBox({
            placeHolder: "例: int string uint byte float Vector2", // 在输入框内的提示信息
            prompt: "变量类型", // 在输入框下方的提示信息
          })
          .then((type) => {
            vscode.window
              .showInputBox({
                placeHolder: "例: health hunger thirst time speed", // 在输入框内的提示信息
                prompt: "变量名", // 在输入框下方的提示信息
              })
              .then((name) => {
                editor?.edit((edit: any) => {
                  edit.insert(
                    editor?.selection.active,
                    `[SyncGetter] static ${type} ${name}_get() => default; [SyncSetter] static void ${name}_set(${type} value) { }\n[Sync] public static ${type} ${name} { get => ${name}_get(); set => ${name}_set(value); }`
                  );
                });
              });
          });
      }
    }
  );

  let projectCreateDisposable = vscode.commands.registerCommand(
    "sky-odyssey-mod-dev.project.create",
    () => {
      if (
        fs.existsSync(
          pathUtil.join(getWorkspacePath(), `${getWorkspaceName()}.sln`)
        )
      ) {
        vscode.window.showWarningMessage(
          "项目已经被创建, 为防止误操作, 请先删除所有创建好的文件, 然后再点击创建"
        );
        return;
      }

      if (hasWorkspace()) {
        createNewTerminal().then((terminal) => {
          var workspace = getWorkspacePath();
          var csprojPath = scriptsPath();

          let entryContent = `using GameCore;\nusing UnityEngine;\n\nnamespace ${getWorkspaceName()}\n{\n    public class ${getWorkspaceName()}ModEntry : ModEntry\n    {\n        public override void OnLoaded()\n        {\n            base.OnLoaded();\n\n            \n        }\n    }\n}`;

          terminal.sendText(`cd "${workspace}"`);
          terminal.sendText(
            `echo "root = true\n\n[*.cs]\ndotnet_diagnostic.IDE1006.severity = none\ndotnet_diagnostic.IDE0060.severity = none" > .editorconfig`
          );
          terminal.sendText(`dotnet new sln --name "${getWorkspaceName()}"`);
          terminal.sendText(`mkdir -p "${csprojPath}"`);
          terminal.sendText(`cd "${csprojPath}"`);
          terminal.sendText("dotnet new classlib");
          terminal.sendText("rm Class1.cs");
          terminal.sendText(
            `echo "${entryContent}" > ${getWorkspaceName()}Entry.cs`
          );
          terminal.sendText("cd " + workspace);
          terminal.sendText(`dotnet sln add "${scriptsProjPath()}"`);

          fs.mkdirSync(supportsPath());
          fs.mkdirSync(joc.modSourcePath());
          fs.mkdirSync(joc.modScriptsPath());
          //TODO: Create All

          showGamePathInputBox();
        });
      }
    }
  );

  let projectUpdateDisposable = vscode.commands.registerCommand(
    "sky-odyssey-mod-dev.project.update",
    () => {
      if (hasWorkspace() && hasGamePath() && hasSoleAssetsPath()) {
        var content = '<Project Sdk="Microsoft.NET.Sdk">\n';
        content += "  <PropertyGroup>\n";
        content += "    <LangVersion>9.0</LangVersion>\n";
        content += "    <TargetFramework>net4.7.1</TargetFramework>\n";
        content += "    <DebugSymbols>true</DebugSymbols>\n";
        content += "    <DebugType>embedded</DebugType>\n";
        content += "  </PropertyGroup>\n";
        content += "  <ItemGroup>\n";

        var managedPath: string;

        switch (process.platform) {
          case "win32":
            managedPath = pathUtil.join(
              getGamePath(),
              "SkyOdyssey_Data",
              "Managed"
            );
            break;

          case "linux":
            managedPath = pathUtil.join(
              getGamePath(),
              "assets",
              "bin",
              "Data",
              "Managed"
            );
            break;

          default:
            throw new Error();
        }

        function addDllFileToContent(f: string) {
          content += `    <Reference Include="${pathUtil.basename(
            f,
            ".dll"
          )}">\n`;
          content += `      <HintPath>${f}</HintPath>\n`;
          content += `    </Reference>\n`;
        }
        addDllFileToContent(
          pathUtil.join(
            getSoleAssetsPath(),
            "mods",
            "ori",
            "scripts",
            "scripts.dll"
          )
        );
        fs.readdirSync(managedPath).forEach((f) => {
          vscode.window.showInformationMessage(pathUtil.extname(f));
          if (pathUtil.extname(f) === ".dll") {
            addDllFileToContent(pathUtil.join(managedPath, f));
          }
        });

        content += "  </ItemGroup>\n";
        content += "</Project>\n";

        fs.writeFileSync(scriptsProjPath(), content);
      }
    }
  );

  let projectGenerationAudioDisposable = vscode.commands.registerCommand(
    "sky-odyssey-mod-dev.project.generation.audio",
    () => {
      if (hasModPath()) {
        var editor = vscode.window.activeTextEditor;
        if (editor && editor.selection && editor.selection.active) {
          vscode.window
            .showInputBox({
              placeHolder: "例: D:\\sources\\music.ogg", // 在输入框内的提示信息
              prompt: "音频源路径", // 在输入框下方的提示信息
              ignoreFocusOut: true,
            })
            .then((originPath) => {
              if (
                !originPath ||
                originPath.length === 0 ||
                !fs.readFileSync(originPath)
              ) {
                vscode.window.showErrorMessage(`无法找到指定的音频`);
                return;
              }

              vscode.window
                .showInputBox({
                  placeHolder:
                    "允许更改以方便分类音频, 例如可以输入 audio\\music\\happy.ogg", // 在输入框内的提示信息
                  prompt: "音频目标路径", // 在输入框下方的提示信息
                  value: `audio\\${pathUtil.basename(originPath)}`,
                  ignoreFocusOut: true,
                })
                .then((targetPath) => {
                  vscode.window
                    .showInputBox({
                      placeHolder: "例: ori:rain ori:music test:attack hi:hurt", // 在输入框内的提示信息
                      prompt: "音频ID", // 在输入框下方的提示信息
                      ignoreFocusOut: true,
                    })
                    .then((id) => {
                      if (!id || id.length === 0) {
                        vscode.window.showErrorMessage(`音频ID不能为空`);
                        return;
                      }

                      vscode.window
                        .showInputBox({
                          placeHolder: "例: 0 0.1 0.2 0.3 0.4 0.5 1 1.0 1.1", // 在输入框内的提示信息
                          prompt: "音量", // 在输入框下方的提示信息
                          value: "1", // 默认值
                          ignoreFocusOut: true,
                        })
                        .then((volumeStr) => {
                          if (
                            !volumeStr ||
                            volumeStr.length === 0 ||
                            !parseFloat(volumeStr)
                          ) {
                            vscode.window.showErrorMessage(`音量不正确`);
                            return;
                          }
                          vscode.window
                            .showInputBox({
                              placeHolder:
                                "例: GameScene; GameScene, MainScene; ", // 在输入框内的提示信息
                              prompt: "自动播放的场景", // 在输入框下方的提示信息
                              value: id, // 默认值
                              ignoreFocusOut: true,
                            })
                            .then((texture) => {});
                        });
                    });
                });
            });
        }
      }
    }
  );

  //TODO: Edit this function
  let projectGenerationBlockDisposable = vscode.commands.registerCommand(
    "sky-odyssey-mod-dev.project.generation.block",
    () => {
      if (hasModPath()) {
        var editor = vscode.window.activeTextEditor;
        if (editor && editor.selection && editor.selection.active) {
          vscode.window
            .showInputBox({
              placeHolder: "例: ori:dirt ori:sand test:stupid hi:new_block", // 在输入框内的提示信息
              prompt: "方块ID", // 在输入框下方的提示信息
              ignoreFocusOut: true,
            })
            .then((id) => {
              if (!id || id.length === 0) {
                vscode.window.showErrorMessage(`方块ID不能为空`);
                return;
              }

              vscode.window
                .showInputBox({
                  placeHolder: "例: 0 1 2 3 4 5 10 11 19 80", // 在输入框内的提示信息
                  prompt: "硬度", // 在输入框下方的提示信息
                  value: "5", // 默认值
                  ignoreFocusOut: true,
                })
                .then((hardnessStr) => {
                  if (!hardnessStr || hardnessStr.length === 0) {
                    vscode.window.showErrorMessage(`方块硬度值不能为空`);
                    return;
                  }
                  vscode.window
                    .showInputBox({
                      placeHolder:
                        "例: ori:dirt ori:dirt_texture, 可以与方块名一致, 也可以不一样", // 在输入框内的提示信息
                      prompt: "纹理ID", // 在输入框下方的提示信息
                      value: id, // 默认值
                      ignoreFocusOut: true,
                    })
                    .then((texture) => {
                      vscode.window
                        .showQuickPick(["true", "false"], {
                          placeHolder: "必须为 true 或 false 中的一个",
                          canPickMany: false,
                          title: "可碰撞",
                          ignoreFocusOut: true,
                        })
                        .then((collidibleStr) => {
                          if (
                            collidibleStr !== "true" &&
                            collidibleStr !== "false"
                          ) {
                            vscode.window.showErrorMessage(
                              `方块的可碰撞值必须为 true 或 false`
                            );
                            return;
                          }
                          vscode.window
                            .showInputBox({
                              placeHolder:
                                "例: GameCore.GrassBlockBehaviour GameCore.DirtBehaviour GameCore.SandBlockBehaviour, 需要包含命名空间, 可留空", // 在输入框内的提示信息
                              prompt: "行为包", // 在输入框下方的提示信息
                              ignoreFocusOut: true,
                            })
                            .then((behaviour) => {
                              var collidible = collidibleStr === "true";
                              var hardness = parseFloat(hardnessStr);

                              //TODO: 只管引用纹理ID
                              if (texture && texture.length !== 0) {
                                joc.writeTextureSetting(
                                  Array.from(
                                    new Set<TextureSettings046_Texture>(
                                      joc.loadTextureSetting()["ori:textures"]
                                    ).add(
                                      new TextureSettings046_Texture(
                                        texture,
                                        "",
                                        undefined
                                      )
                                    )
                                  )
                                );
                              }
                            });
                        });
                    });
                });
            });
        }
      }
    }
  );

  let debugBuildDisposable = vscode.commands.registerCommand(
    "sky-odyssey-mod-dev.debug.build",
    () => {
      if (hasWorkspace() && hasModPath()) {
        createNewTerminal().then((terminal) => {
          var workspace = getWorkspacePath();
          terminal.sendText(`dotnet build "${scriptsProjPath()}"`);
          var dllPath = `"${pathUtil.join(
            workspace,
            "scripts",
            "bin",
            "Debug",
            "net4.7.1",
            "scripts.dll"
          )}"`;

          var targetPath = `"${pathUtil.join(
            joc.modScriptsPath(),
            "scripts.dll"
          )}"`;
          let commands = new Set<string>();
          if (fs.existsSync(targetPath)) {
            commands.add(`rm -force ${targetPath}`);
          }
          commands.add(`cp -force ${dllPath} ${targetPath}`);
          if (fs.existsSync(modTargetPath())) {
            commands.add(`rm -r -force ${modTargetPath()}`);
          }
          commands.add(
            `cp -r -force ${joc.modSourcePath()} ${modTargetPath()}`
          );

          switch (process.platform) {
            case "win32":
              commands.forEach((element) => {
                terminal.sendText(element);
              });
              break;

            default:
              var shPath = pathUtil.join(getWorkspacePath(), "build.sh");
              var content = "";
              commands.forEach((element) => {
                content += element + "\n";
              });

              if (fs.readFileSync(shPath)) {
                fs.rmSync(shPath);
              }
              fs.writeFileSync(shPath, content);
              break;
          }
        });
      }
    }
  );

  let debugBuildAndRunDisposable = vscode.commands.registerCommand(
    "sky-odyssey-mod-dev.debug.build_and_run",
    () => {
      if (hasWorkspace() && hasModPath() && hasGamePath()) {
        createNewTerminal().then(async (terminal) => {
          var workspace = getWorkspacePath();
          terminal.sendText(`dotnet build "${scriptsProjPath()}"`);
          var dllPath = `"${pathUtil.join(
            workspace,
            "scripts",
            "bin",
            "Debug",
            "net4.7.1",
            "scripts.dll"
          )}"`;
          var targetPath = `"${pathUtil.join(
            joc.modScriptsPath(),
            "scripts.dll"
          )}"`;
          if (fs.existsSync(targetPath)) {
            terminal.sendText(`rm -force ${targetPath}`);
          }
          terminal.sendText(`cp -force ${dllPath} ${targetPath}`);
          if (fs.existsSync(modTargetPath())) {
            terminal.sendText(`rm -r -force ${modTargetPath()}`);
          }
          terminal.sendText(
            `cp -r -force ${joc.modSourcePath()} ${modTargetPath()}`
          );
          waitForTerminalCompletion(terminal).then(() => {
            killGame().then(() => {
              runGame();
            });
          });
        });
      }
    }
  );

  let debugRunDisposable = vscode.commands.registerCommand(
    "sky-odyssey-mod-dev.debug.run",
    () => {
      if (hasWorkspace() && hasGamePath()) {
        killGame().then(() => {
          runGame();
        });
      }
    }
  );

  let debugStopDisposable = vscode.commands.registerCommand(
    "sky-odyssey-mod-dev.debug.stop",
    () => {
      if (hasWorkspace() && hasGamePath()) {
        if (!childProcess) {
          vscode.window.showWarningMessage(
            "游戏子进程不存在, 请先点击运行/导出并运行, 不要自行运行游戏的 .exe 文件"
          );
        } else {
          killGame();
        }
      }
    }
  );

  let debugCleanDisposable = vscode.commands.registerCommand(
    "sky-odyssey-mod-dev.debug.clean",
    async () => {
      if (hasWorkspace()) {
        createNewTerminal().then((terminal) => {
          terminal.sendText(`dotnet clean "${scriptsProjPath()}"`);
        });
      }
    }
  );

  let gitReaddAllFilesDisposable = vscode.commands.registerCommand(
    "sky-odyssey-mod-dev.git.readd-all-files",
    async () => {
      if (hasWorkspace()) {
        createNewTerminal().then((terminal) => {
          terminal.sendText(`git rm -r --cached . ; git add .`);
        });
      }
    }
  );

  let gitRevertLastChangeDisposable = vscode.commands.registerCommand(
    "sky-odyssey-mod-dev.git.revert-last-change",
    async () => {
      if (hasWorkspace()) {
        createNewTerminal().then((terminal) => {
          terminal.sendText(`git revert HEAD`);
        });
      }
    }
  );

  let gitRevertBeforeLastChangeDisposable = vscode.commands.registerCommand(
    "sky-odyssey-mod-dev.git.revert-before-last-change",
    async () => {
      if (hasWorkspace()) {
        createNewTerminal().then((terminal) => {
          terminal.sendText(`git revert HEAD^`);
        });
      }
    }
  );

  let gitResetUpstreamBranchDisposable = vscode.commands.registerCommand(
    "sky-odyssey-mod-dev.git.reset-upstream-branch",
    async () => {
      if (hasWorkspace()) {
        createNewTerminal().then((terminal) => {
          vscode.window
            .showInputBox({
              title: "分支",
              ignoreFocusOut: true,
              value: "origin/main",
            })
            .then((branch) => {
              terminal.sendText(`git branch --set-upstream-to=${branch}`);
            });
        });
      }
    }
  );

  let minifyJsonDisposable = vscode.commands.registerCommand(
    "sky-odyssey-mod-dev.json.minify",
    () => {
      let editor = vscode.window.activeTextEditor;
      if (editor) {
        var originalText = editor.document.getText();
        var processedText = JSON.stringify(JSON.parse(originalText));

        let document = editor.document;
        let firstLine = document.lineAt(0);
        let lastLine = document.lineAt(document.lineCount - 1);
        let range = new vscode.Range(firstLine.range.start, lastLine.range.end);
        let edit = new vscode.TextEdit(range, processedText);
        let workspaceEdit = new vscode.WorkspaceEdit();
        workspaceEdit.set(document.uri, [edit]);
        vscode.workspace.applyEdit(workspaceEdit);
      }
    }
  );

  context.subscriptions.push(syncDisposable);
  context.subscriptions.push(syncStaticDisposable);
  context.subscriptions.push(debugBuildDisposable);
  context.subscriptions.push(debugBuildAndRunDisposable);
  context.subscriptions.push(debugRunDisposable);
  context.subscriptions.push(debugStopDisposable);
  context.subscriptions.push(debugCleanDisposable);
  context.subscriptions.push(projectCreateDisposable);
  context.subscriptions.push(projectUpdateDisposable);
  context.subscriptions.push(projectGenerationAudioDisposable);
  context.subscriptions.push(projectGenerationBlockDisposable);
  context.subscriptions.push(gitReaddAllFilesDisposable);
  context.subscriptions.push(gitRevertLastChangeDisposable);
  context.subscriptions.push(gitRevertBeforeLastChangeDisposable);
  context.subscriptions.push(gitResetUpstreamBranchDisposable);
  context.subscriptions.push(minifyJsonDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

function showGamePathInputBox() {
  var placeHolder;
  var defaultValue = undefined;

  switch (process.platform) {
    case "win32":
      placeHolder =
        "先找到 SkyOdyssey.exe, 然后填写 SkyOdyssey.exe 所处的目录, 如 D:\\Game, 不能写 D:\\Game\\SkyOdyssey";
      break;

    case "linux":
      defaultValue =
        "/storage/emulated/0/Android/data/com.SavingPotStudio.SkyOdyssey/files/self_cache/game_apk_unzipped/";
      placeHolder =
        "先确保运行过游戏, 然后输入 /storage/emulated/0/Android/data/com.SavingPotStudio.SkyOdyssey/files/self_cache/game_apk_unzipped/";
      break;

    default:
      throw new Error();
  }

  vscode.window
    .showInputBox({
      placeHolder: placeHolder, // 在输入框内的提示信息
      prompt: "游戏文件夹", // 在输入框下方的提示信息
      ignoreFocusOut: true,
      value: defaultValue,
    })
    .then((input) => {
      if (input) {
        fs.writeFileSync(gameTxtPath(), input);
        showModPathInputBox();
      } else {
        showGamePathInputBox();
      }
    });
}

function showModPathInputBox() {
  var placeHolder;
  var defaultValue = undefined;

  switch (process.platform) {
    case "win32":
      placeHolder =
        "直接输入所有模组的根, 可以在游戏中点击 模组管理->打开源文件夹, 然后复制到输入框";
      break;

    case "linux":
      defaultValue =
        "/storage/emulated/0/Android/data/com.SavingPotStudio.SkyOdyssey/files/mods/";
      placeHolder =
        "输入 /storage/emulated/0/Android/data/com.SavingPotStudio.SkyOdyssey/files/mods/";
      break;

    default:
      throw new Error();
  }

  vscode.window
    .showInputBox({
      placeHolder: placeHolder, // 在输入框内的提示信息
      prompt: "游戏模组总文件夹", // 在输入框下方的提示信息
      ignoreFocusOut: true,
      value: defaultValue,
    })
    .then((input) => {
      if (input) {
        fs.writeFileSync(modTxtPath(), input);
        showSoleAssetsPathInputBox();
      } else {
        showModPathInputBox();
      }
    });
}

function showSoleAssetsPathInputBox() {
  var placeHolder;
  var defaultValue = undefined;

  switch (process.platform) {
    case "win32":
      placeHolder =
        "找到游戏版本对应的 sole_assets, 如 D:\\Game\\SkyOdyssey_Data\\Managed\\StreamingAssets\\sole_assets"; // 在输入框内的提示信息
      break;

    case "linux":
      defaultValue =
        "/storage/emulated/0/Android/data/com.SavingPotStudio.SkyOdyssey/files/self_cache/game_apk_unzipped/assets/sole_assets/";
      placeHolder =
        "输入 /storage/emulated/0/Android/data/com.SavingPotStudio.SkyOdyssey/files/self_cache/game_apk_unzipped/assets/sole_assets/";
      break;

    default:
      throw new Error();
  }

  vscode.window
    .showInputBox({
      placeHolder: placeHolder,
      prompt: "独有资源文件夹", // 在输入框下方的提示信息
      ignoreFocusOut: true,
      value: defaultValue,
    })
    .then((input) => {
      if (input) {
        fs.writeFileSync(soleAssetsTxtPath(), input);
        showModIdInputBox();
      } else {
        showSoleAssetsPathInputBox();
      }
    });
}

function showModIdInputBox() {
  vscode.window
    .showInputBox({
      placeHolder: "例如: try test new_items stronger_enemies harder_game", // 在输入框内的提示信息
      prompt: "模组ID", // 在输入框下方的提示信息
      ignoreFocusOut: true,
    })
    .then((input) => {
      if (input && input.length !== 0) {
        joc.writeInfo(input);
        joc.writeTextureSetting([]);
      } else {
        showModIdInputBox();
      }
    });
}

function createNewTerminal() {
  if (!vscode.window.activeTerminal) {
    const terminal = vscode.window.createTerminal();
    terminal.show(true); // 将新终端设置为活动终端并显示

    return new Promise<Terminal>((resolve) => {
      const disposable = vscode.window.onDidChangeActiveTerminal(
        (newTerminal) => {
          if (newTerminal === terminal) {
            disposable.dispose(); // 取消监听事件
            resolve(newTerminal); // 解析 Promise
          }
        }
      );
    });
  }
  return new Promise<Terminal>((resolve) => {
    if (!vscode.window.activeTerminal) {
      throw new Error();
    }

    resolve(vscode.window.activeTerminal); // 解析 Promise
  });
}

async function waitForTerminalCompletion(terminal: Terminal) {
  terminal.sendText("exit");

  return new Promise<void>((resolve) => {
    const disposable = vscode.window.onDidCloseTerminal((closedTerminal) => {
      if (closedTerminal === terminal) {
        resolve();
        disposable.dispose();
      }
    });
  });
}

function runGame() {
  switch (process.platform) {
    case "win32":
      childProcess = child.spawn(
        "am start -n com.SavingPotStudio.SkyOdyssey/com.unity3d.player.UnityPlayerActivity"
      );
      break;

    case "linux":
      childProcess = child.spawn(getGameExePath());
      break;

    default:
      throw new Error();
  }
}

function killGame() {
  return new Promise<void>((resolve) => {
    if (!childProcess) {
      resolve();
    }

    // 发送终止信号给进程
    createNewTerminal().then((terminal) => {
      if (childProcess) {
        switch (process.platform) {
          case "win32":
            terminal.sendText(`taskkill /pid ${childProcess.pid} /f`);
            waitForTerminalCompletion(terminal).then(() => {
              childProcess = undefined;
              resolve();
            });
            break;

          case "linux":
            childProcess.kill();
            break;

          default:
            throw new Error();
        }
      }
    });
  });
}

export function getWorkspacePath() {
  if (vscode.workspace.workspaceFolders !== undefined) {
    return vscode.workspace.workspaceFolders[0].uri.fsPath;
  } else {
    return "";
  }
}

function getWorkspaceName() {
  var splitted = getWorkspacePath().split(pathUtil.sep);
  return splitted[splitted.length - 1];
}

function hasWorkspace() {
  var result = vscode.workspace.workspaceFolders !== undefined;

  if (!result) {
    vscode.window.showErrorMessage(
      "请先创建工作区, 然后再使用该插件, 否则插件无法正常运行"
    );
  }

  return result;
}

function hasGamePath() {
  var path = gameTxtPath();
  var result = fs.existsSync(path);

  if (!result) {
    vscode.window.showErrorMessage(
      `请先在工作区创建 ${path}, 并在该文件中写入游戏文件夹的目录, 然后再使用该插件, 否则插件无法正常运行`
    );
  }

  return result;
}

function hasSoleAssetsPath() {
  var path = soleAssetsTxtPath();
  var result = fs.existsSync(path);

  if (!result) {
    vscode.window.showErrorMessage(
      `请先在工作区创建 ${path}, 并在该文件中写入游戏文件夹的目录, 然后再使用该插件, 否则插件无法正常运行`
    );
  }

  return result;
}

function getGamePath() {
  var path = gameTxtPath();
  let fileContent = fs.readFileSync(path, "utf8");
  return fileContent;
}

function getGameExePath() {
  return pathUtil.join(getGamePath(), "SkyOdyssey.exe");
}

function hasModPath() {
  var path = modTxtPath();
  var result = fs.existsSync(path);

  if (!result) {
    vscode.window.showErrorMessage(
      `请先在工作区创建 ${path}, 并在该文件中写入您的模组的目录, 然后再使用该插件, 否则插件无法正常运行`
    );
  }

  return result;
}

function getModPath() {
  var path = modTxtPath();
  let fileContent = fs.readFileSync(path, "utf8");
  return fileContent;
}

function getSoleAssetsPath() {
  var path = soleAssetsTxtPath();
  let fileContent = fs.readFileSync(path, "utf8");
  return fileContent;
}

function modTxtPath() {
  return pathUtil.join(supportsPath(), "mod_path.txt");
}

function gameTxtPath() {
  return pathUtil.join(supportsPath(), "game_path.txt");
}

function soleAssetsTxtPath() {
  return pathUtil.join(supportsPath(), "sole_assets_path.txt");
}

function supportsPath() {
  return pathUtil.join(getWorkspacePath(), "plugin_supports");
}

function scriptsPath() {
  return pathUtil.join(getWorkspacePath(), "scripts");
}

function scriptsProjPath() {
  return pathUtil.join(scriptsPath(), "scripts.csproj");
}

function modTargetPath() {
  return pathUtil.join(getModPath(), getWorkspaceName());
}
