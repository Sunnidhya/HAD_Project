package com.example.had_backend.Global.Model;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import org.springframework.lang.Nullable;

import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
public class ChatsDTO {
    @NonNull
    private Integer radioId;

    @NonNull
    private String radioName;

    @Nullable
    private String radioImpression;

    @Nullable
    List<ThreadsDTO> threadsDTO = new ArrayList<>();
}
